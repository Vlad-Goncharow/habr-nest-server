import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { MailService } from "src/mail/mail.service";
import { RefreshTokensService } from "src/refresh-tokens/refresh-tokens.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/users.model";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/LoginDto";
import { UpdateProfileDto } from "./dto/UpdateProfileDto";
import { AuthUtilService } from "./types";

@Injectable()
export class AuthRealService implements AuthUtilService {
  constructor(private readonly mailService: MailService,private userService: UsersService,
              private refreshTokenServie: RefreshTokensService,
              private jwtService:JwtService) {}

  async registration(dto: CreateUserDto): Promise<{ cookies: any; result: any }> {
    const candidateEmail = await this.userService.getUserByEmail(dto.email)
    const candidateNickname = await this.userService.getUserByNickname(dto.nickname)

    if (candidateEmail){
      throw new HttpException({ message: 'Данная почта занята', param:'email'}, HttpStatus.BAD_REQUEST)
    }

    if (candidateNickname){
      throw new HttpException({ message: 'Данный ник занят', param:'nickname'}, HttpStatus.BAD_REQUEST)
    }

    const hashPassword = await bcrypt.hash(dto.password, 5)

    const createdUser = await this.userService.createUser({ ...dto, password:hashPassword})
    const user = await this.userService.loadCurrentUserById(createdUser.id)

    const accessToken = await this.generateToken(user)
    const refreshToken = await this.refreshTokenServie.generateRefreshToken(user)
    const { token } = await this.refreshTokenServie.saveToken(user.id, refreshToken)

    const cookies = {
      refreshToken: token,
      options: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    };

    await this.mailService.sendMail(user)

    return { 
      cookies, 
      result: { 
        user,
        accessToken,
        refreshToken: token
      } 
    };
  }

  async login(dto:LoginDto): Promise<{ cookies: any; result: any }>{
    const userEmail = await this.userService.getUserByEmail(dto.email)

    if (!userEmail) {
      throw new HttpException({ message: 'Данная почта не зарегистрирована', param:'email'}, HttpStatus.BAD_REQUEST)
    }

    const checkPass = await bcrypt.compare(dto.password, userEmail.password)
    if (!checkPass) {
      throw new HttpException({message:"Неверный пароль",param:'password'}, HttpStatus.BAD_REQUEST)
    }

    const user = await this.userService.loadCurrentUserById(userEmail.id)
    const accessToken = await this.generateToken(user)
    const refreshToken = await this.refreshTokenServie.generateRefreshToken(user)
    const { token } = await this.refreshTokenServie.saveToken(user.id, refreshToken)

    const cookies = {
      refreshToken: token,
      options: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    };

    return{
      cookies,
      result:{
        user,
        accessToken,
        refreshToken: token
      }
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

    const cookies = {
      refreshToken: token,
      options: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    };

    return {
      cookies,
      result:{
        user,
        accessToken,
        refreshToken: token
      }
    }
  }

  async logout(userId:number){
    return await this.refreshTokenServie.deleteToken(userId)
  }

  async resendVerification(user:User): Promise<{success:boolean}>{
    const data = await this.mailService.sendMail(user)
    
    return {
      ...data 
    };
  }

  async confirmEmail(userId:number){
    const data = await this.mailService.verifyMail(userId)
    return {
      success: data.success, 
    };
  }

  async profileUpdate(userId:number, dto:UpdateProfileDto){
    await this.userService.updateProfile(userId, dto)
    const user = await this.userService.loadCurrentUserById(userId)
    
    return user
  }

  async deleteUser(tokenId:number, userId:number){
    if (tokenId !== userId) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.getUserById(userId);
      
      await this.refreshTokenServie.deleteToken(user.id);
      await this.userService.deleteUser(user.id);

      return {
        success: true,
      };
  }

  private generateToken(user:User){
    const payload = { email: user.email, id: user.id, roles: user.roles }

    const access = this.jwtService.sign(payload)
   
    return access
  }
}