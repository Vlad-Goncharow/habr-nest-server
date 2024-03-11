import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Выдать роль
  @ApiOperation({ summary: "Выдать роль" })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/:userId/role/:roleId/add')
  addRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.usersService.addRole(userId, roleId)
  }


  //Забрать роль
  @ApiOperation({ summary: "Забрать роль" })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/:userId/role/:roleId/remove')
  removeRole(@Param('userId') userId:string, @Param('roleId') roleId:string) {
    return this.usersService.removeRole(userId, roleId)
  }


  //Получение пользователя
  @ApiOperation({ summary: "Получение пользователя" })
  @Get('/:userId')
  async getUserById(@Param('userId') userId: string) {
    return this.usersService.getUserById(Number(userId))
  }


  //Получение хабов пользователя на которые он подписан
  @ApiOperation({ summary: "Получение хабов пользователя на которые он подписан" })
  @Get('/:userId/habs')
  async loadUserHabs(@Param('userId') userId: string) {
    return this.usersService.loadUserHabs(Number(userId))
  }


  //Подписка на человека
  @ApiOperation({ summary: "Подписка на человека" })
  @UseGuards(JwtAuthGuard)
  @Post('/subscribe/:userId')
  async subscribe(@Req() req, @Param('userId') userId: string) {
    const {id} = req.user
    return this.usersService.subscribe(id, Number(userId))
  }


  //Отписка от человека
  @ApiOperation({ summary: "Отписка от человека" })
  @UseGuards(JwtAuthGuard)
  @Post('/unsubscribe/:userId')
  async unSubscribe(@Req() req, @Param('userId') userId: string) {
    const { id } = req.user
    return this.usersService.unSubscribe(id, Number(userId))
  }
}
