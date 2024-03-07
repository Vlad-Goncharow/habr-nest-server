import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './refresh-tokens.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';

@Module({
  controllers: [RefreshTokensController],
  providers: [RefreshTokensService],
  imports:[
    JwtModule.register({
      secret: process.env.JWT_REFRESH_SECRET_REFRESH || 'SECRET',
      signOptions: {
        expiresIn: '7d'
      }
    }),
    SequelizeModule.forFeature([User,RefreshToken]),
  ],
  exports:[
    RefreshTokensService
  ]
})
export class RefreshTokensModule {}
