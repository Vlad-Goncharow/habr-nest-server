import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService,
              private usersService: UsersService,
              private configService: ConfigService
              ) {}
  
  async sendMail(user:User){
    const urlConfirmAddress = this.configService.get<string>(
      'URL_CONFIRM_ADDRESS',
    );

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Подтверждение регистрации',
        from: 'vladuska159@gmail.com',
        template: join(__dirname, '/../templates', 'confirmRegister'),
        context: {
          id: user.id,
          username: user.nickname,
          urlConfirmAddress
        },
      });

      return {
        success:true
      }
    } catch (err) {
      throw err
    }
  }

  async verifyMail(id:number){
    try{
      const user = await this.usersService.getUserById(id)

      user.isActive = true
      user.save()

      return {
        success:true
      }
    } catch(e){
      throw e
    }
  }
}