import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.model';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private refreshTokenServie: RefreshTokensService,
              private jwtService:JwtService){}

  async registration(userDto: CreateUserDto) {
    const candidateEmail = await this.userService.getUserByEmail(userDto.email)
    const candidateNickname = await this.userService.getUserByNickname(userDto.nickname)

    if (candidateEmail){
      throw new HttpException({ message: 'Данная почта занята', param:'email'}, HttpStatus.BAD_REQUEST)
    }

    if (candidateNickname){
      throw new HttpException({ message: 'Данная ник занят', param:'nickname'}, HttpStatus.BAD_REQUEST)
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5)

    const createdUser = await this.userService.createUser({ ...userDto, password:hashPassword})
    const user = await this.userService.loadCurrentUserById(createdUser.id)

    const accessToken = await this.generateToken(user)
    const refreshToken = await this.refreshTokenServie.generateRefreshToken(user)
    const { token } = await this.refreshTokenServie.saveToken(user.id, refreshToken)
    
    return {
      user,
      accessToken,
      refreshToken: token
    }
  }

  async login(userDto: CreateUserDto) {
    const userEmail = await this.userService.getUserByEmail(userDto.email)

    if (!userEmail) {
      throw new HttpException({ message: 'Данная почта не зарегистрирована', param:'email'}, HttpStatus.BAD_REQUEST)
    }

    const checkPass = await bcrypt.compare(userDto.password, userEmail.password)
    if (!checkPass) {
      throw new HttpException({message:"Неверный пароль",param:'password'}, HttpStatus.BAD_REQUEST)
    }

    const user = await this.userService.loadCurrentUserById(userEmail.id)
    const accessToken = await this.generateToken(user)
    const refreshToken = await this.refreshTokenServie.generateRefreshToken(user)
    const { token } = await this.refreshTokenServie.saveToken(user.id, refreshToken)

    return {
      user,
      accessToken,
      refreshToken: token
    }
  }

  async refresh(refreshToken: string){
    if (!refreshToken){
      throw new UnauthorizedException()
    }

    const userData = await this.refreshTokenServie.validateToken(refreshToken)
    const tokenFromDb = await this.refreshTokenServie.findTokenFromDb(refreshToken)

    if(!userData || !tokenFromDb){
      throw new UnauthorizedException()
    }

    const user = await this.userService.loadCurrentUserById(userData.id)
    if(!user){
      throw new UnauthorizedException()
    }

    const accessToken = await this.generateToken(user)
    const generateRefreshToken = await this.refreshTokenServie.generateRefreshToken(user)
    const { token } = await this.refreshTokenServie.saveToken(user.id, generateRefreshToken)

    return {
      user,
      accessToken,
      refreshToken: token
    }
  }

  async logout(id:number){
    return await this.refreshTokenServie.deleteToken(id)
  }

  async profileUpdate(id: number, dto: UpdateProfileDto){
    await this.userService.updateProfile(id, dto)
    const user = await this.userService.loadCurrentUserById(id)
    
    return user
  }

  private generateToken(user:User){
    const payload = { email: user.email, id: user.id, roles: user.roles }

    const access = this.jwtService.sign(payload)
   
    return access
  }
}
