import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { MailService } from 'src/mail/mail.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailService: MailService
  ) {}

  //Регистрация пользователя
  @ApiOperation({ summary: "Регистрация пользователя" })
  @Post('/registration')
  async registration(@Res() res:Response, @Body() dto: CreateUserDto) {
    const userData = await this.authService.registration(dto);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })
    this.mailService.sendMail(userData.user)

    return res.json({
      ...userData,
    })
  }

  //Повторная отправка письма для подтверждения почты
  @ApiOperation({ summary: "Повторная отправка письма для подтверждения почты" })
  @UseGuards(JwtAuthGuard)
  @Post('/send/verify/:userId')
  async sendVerify(@Req() req, ) {
    const user = req.user
    const data = await this.mailService.sendMail(user)
    
    return {
      ...data 
    };
  }

  //Подтверждение почты
  @ApiOperation({ summary: "Подтверждение почты" })
  @Render('confirmEmail')
  @Get('/confirm/:userId')
  async confirmEmail(
    @Param('userId', ParseIntPipe) userId: number
  ) {
    const data = await this.mailService.verifyMail(userId)
    return {
      success: data.success, 
    };
  }

  //Авторизация пользователя
  @ApiOperation({ summary: "Авторизация пользователя" })
  @Post('/login')
  async login(@Res() res: Response , @Body() dto: CreateUserDto) {
    const userData = await this.authService.login(dto)

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })

    return res.json({
      ...userData,
    })
  }


  //Обновление токена
  @ApiOperation({ summary: "Обновление токена" })
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies

    const userData = await this.authService.refresh(refreshToken)

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })

    return res.json({
      ...userData,
    })
  }

  //Выход
  @ApiOperation({ summary: "Выход" })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req, @Res() res: Response) {
    const { id } = req.user

    const userData = await this.authService.logout(id)
    
    res.clearCookie("refreshToken");
    res.json(userData)
  }

  //Обновление профиля
  @ApiOperation({ summary: "Обновление профиля" })
  @UseGuards(JwtAuthGuard)
  @Patch('/profile-update')
  async profileUpdate(@Req() req, @Body() dto: UpdateProfileDto, @Res() res: Response) {
    const { id } = req.user

    const userData = await this.authService.profileUpdate(id, dto)

    res.json(userData)
  }

  //Удаление пользователя
  @ApiOperation({ summary: "Удаление пользователя" })
  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  async deleteUser(@Req() req, @Res() res: Response, @Param('userId', ParseIntPipe) userId: number) {
    const {id} = req.user

    const data = await this.authService.deleteUser(id, userId)
    res.cookie('refreshToken', '',)
    res.json({
      ...data
    })
  }
}
