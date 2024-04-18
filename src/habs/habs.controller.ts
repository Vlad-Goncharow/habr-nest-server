import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateHabDto } from './dto/create-hab.dto';
import { SubscribeDto } from './dto/subscribe-hab.dto';
import { HabsService } from './habs.service';

@ApiTags('Хабы')
@Controller('habs')
export class HabsController {
  constructor(private readonly habsService: HabsService) {}

  //Создание хаба
  @ApiOperation({ summary: "Создание хаба" })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createHabDto: CreateHabDto) {
    return this.habsService.createHab(createHabDto);
  }


  //Загрузка хаба
  @ApiOperation({ summary: "Загрузка хаба" })
  @Get('/:id')
  loadHabById(@Param('id') id: string){
    return this.habsService.loadHabById(Number(id))
  }


  //Загрузка короткой информации о хабе
  @ApiOperation({ summary: "Загрузка короткой информации о хабе" })
  @Get('/short/:id')
  loadShortHabById(@Param('id') id: string) {
    return this.habsService.loadShortHabById(Number(id))
  }


  //Загрузка авторов хаба
  @ApiOperation({ summary: "Загрузка авторов хаба" })
  @Get('/load/:id/authors')
  loadHabAuthors
  (
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ){
    return this.habsService.loadHabAuthors(id, page, pageSize)
  }


  //Подписка на хаб
  @ApiOperation({ summary: "Подписка на хаб" })
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribeToHab(@Body() subscribeDto: SubscribeDto){
    return this.habsService.subscribeToHab(subscribeDto);
  }


  //Отписка с хаба
  @ApiOperation({ summary: "Отписка с хаба" })
  @UseGuards(JwtAuthGuard)
  @Post('unsubscribe')
  async unSubscribeToHab(@Body() subscribeDto: SubscribeDto) {
    return this.habsService.unSubscribeToHab(subscribeDto);
  }


  //Получение хабов пользователя на которые он подписан
  @ApiOperation({ summary: "Получение хабов пользователя на которые он подписан" })
  @Get('/:userId/subscribers')
  async loadUserHabs(@Param('userId') userId: string) {
    return this.habsService.loadUserHabs(Number(userId))
  }


  //Получение хабов по названия
  @ApiOperation({ summary: "Получение хабов" })
  @Get('/all/list')
  async getAllHabs() {
    return this.habsService.getAllHabs()
  }
}
