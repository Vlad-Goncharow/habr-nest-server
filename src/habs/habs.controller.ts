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

  
  
  //Пойск хаба по категории
  @ApiOperation({ summary: "Пойск хаба по категории" })
  @Get('/search/:category/:title')
  loadHabsByValues(
    @Param('category') category: string,
    @Param('title') title: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
  ) {
    return this.habsService.loadHabsByValues(category, title, sort, order, page, pageSize)
  }


  //Пойск хаба
  @ApiOperation({ summary: "Пойск хаба" })
  @Get('/search/:title')
  searchHabs(
    @Param('title') title: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
  ) {
    return this.habsService.searchHabs(title, page, pageSize, sort, order)
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
  @Get('/user/:userId/subscribed-habs')
  async loadUserHabs(@Param('userId') userId: string) {
    return this.habsService.loadUserHabs(Number(userId))
  }


  //Получение хабов по названию
  @ApiOperation({ summary: "Получение хабов" })
  @Get('/all/list')
  async getAllHabs() {
    return this.habsService.getAllHabs()
  }


  //Получение хабов на главной по категории
  @ApiOperation({ summary: "Получение хабов на главной по категории" })
  @Get('/category/:category')
  async loadHabsByCategory(@Param('category') category: string) {
    return this.habsService.loadHabsByCategory(category)
  }
}
