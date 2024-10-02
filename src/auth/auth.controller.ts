import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { LoginDto } from './dto/LoginDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUtilService } from './types';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_UTIL_SERVICE') private readonly authService: AuthUtilService,
  ) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован', type: User }) 
  @ApiResponse({ status: 400, description: 'Некорректные данные' }) 
  @Post('registration')
  async registration(@Res() res: Response, @Body() dto: CreateUserDto) {
    const { cookies, result } = await this.authService.registration(dto);
    res.cookie('refreshToken', cookies.refreshToken, cookies.options);
    return res.json({...result});
  }


  @ApiOperation({ summary: "Авторизация пользователя" })
  @Post('/login')
  async login(@Res() res: Response , @Body() dto: LoginDto) {
    const { cookies, result } = await this.authService.login(dto);
    res.cookie('refreshToken', cookies.refreshToken, cookies.options);
    return res.json({...result});
  }


  @ApiOperation({ summary: "Повторная отправка письма для подтверждения почты" })
  @UseGuards(JwtAuthGuard)
  @Post('/send/verify/:userId')
  async resendVerification(@Req() req) {
    const user = req.user
    const data = await this.authService.resendVerification(user)
    
    return {
      ...data 
    };
  }

  @ApiOperation({ summary: "Подтверждение почты" })
  @Render('confirmEmail')
  @Get('/confirm/:userId')
  async confirmEmail(@Param('userId', ParseIntPipe) userId: number ) {
    const data = await this.authService.confirmEmail(userId)
    return {
      success: data.success, 
    };
  }

  //Обновление токена
  @ApiOperation({ summary: "Обновление токена" })
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const {refreshToken} = req.cookies

    const { cookies, result } = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', cookies.refreshToken, cookies.options);
    return res.json({...result});
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/profile-update')
  async profileUpdate(@Req() req, @Body() dto: UpdateProfileDto, @Res() res: Response) {
    const { id } = req.user

    const userData = await this.authService.profileUpdate(id, dto)

    res.json(userData)
  }

  //Удаление пользователя
  @ApiOperation({ summary: "Удаление пользователя" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  async deleteUser(@Req() req, @Res() res: Response, @Param('userId', ParseIntPipe) userId: number) {
    const {id} = req.user

    const data = await this.authService.deleteUser(id, userId)
    res.cookie('refreshToken', '',)

    return res.json({...data})
  }
}
