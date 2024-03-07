import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { RefreshToken } from './refresh-tokens.model';

@Injectable()
export class RefreshTokensService {
  constructor(@InjectModel(RefreshToken) private refreshTokenRepository: typeof RefreshToken, private jwtService: JwtService) { }

  async generateRefreshToken(user:User){
    const payload = { email: user.email, id: user.id, roles: user.roles }

    const refresh = this.jwtService.sign(payload)

    return refresh
  }

  async saveToken(id:number, token:string){
    const existingToken = await this.refreshTokenRepository.findOne({where:{userId:id}});

    if (existingToken) {
      existingToken.token = token;
      return existingToken.save();
    }

    const refreshToken = await this.refreshTokenRepository.create({ userId: id, token: token })

    return refreshToken;
  }

  async deleteToken(userId:number){
    const token = await this.refreshTokenRepository.findOne({where:{userId}})

    if (!token) {
      throw new HttpException('Токен не найден', HttpStatus.NOT_FOUND)
    }

    token.destroy()

    return {
      success:true
    }
  }

  async validateToken(refreshToken:string){
    const userData = this.jwtService.verify(refreshToken)
    return userData
  }

  async findTokenFromDb(refreshToken:string){
    const token = await this.refreshTokenRepository.findOne({ where: { token: refreshToken }})

    if(!token){
      throw new HttpException('Токен не найден', HttpStatus.NOT_FOUND)
    }

    return token
  }
}
