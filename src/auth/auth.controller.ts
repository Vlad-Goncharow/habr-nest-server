import { Body, Controller, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    return res.json({
      ...userData,
    })
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
}
