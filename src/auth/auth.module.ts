import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { RefreshTokensModule } from 'src/refresh-tokens/refresh-tokens.module';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthMockService } from './authMockService';
import { AuthRealService } from './authRealService';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_UTIL_SERVICE',
      useFactory: (
        configService: ConfigService,
        mailService: MailService,
        userService: UsersService,
        refreshTokenService: RefreshTokensService,
        jwtService: JwtService,
      ) => {
        const authMock: number = parseInt(configService.get<string>('AUTH_MOCK', '0'));
        return authMock ? new AuthMockService() : new AuthRealService(mailService, userService, refreshTokenService, jwtService);
      },
      inject: [ConfigService, MailService, UsersService, RefreshTokensService, JwtService],
    },
  ],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_REFRESH_SECRET_ACCESS || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    RefreshTokensModule,
    MailModule,
    ConfigModule,
  ],
  exports: [
    'AUTH_UTIL_SERVICE',
    JwtModule,
  ],
})
export class AuthModule {}
