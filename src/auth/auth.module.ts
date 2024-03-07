import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';
import { RefreshTokensModule } from 'src/refresh-tokens/refresh-tokens.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_REFRESH_SECRET_ACCESS || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
    RefreshTokensModule
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
