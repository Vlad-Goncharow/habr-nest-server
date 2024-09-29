import { forwardRef, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports:[
    ConfigModule,
    forwardRef(() => UsersModule),
  ],
  exports: [
    MailService
  ]
})
export class MailModule {}
