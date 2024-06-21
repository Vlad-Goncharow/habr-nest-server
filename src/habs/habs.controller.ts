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

  //create hab
  @ApiOperation({ summary: "create hab" })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createHabDto: CreateHabDto) {
    return this.habsService.createHab(createHabDto);
  }


  //load single hab data
  @ApiOperation({ summary: "load single hab data" })
  @Get('/:id')
  loadHabById(@Param('id') id: string){
    return this.habsService.loadHabById(Number(id))
  }

  
  //load habs by category | title, main page, search page
  @ApiOperation({ summary: "load habs by category | title, main page, search page" })
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


  //load hab authors
  @ApiOperation({ summary: "load hab authors" })
  @Get('/load/:id/authors')
  loadHabAuthors
  (
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ){
    return this.habsService.loadHabAuthors(id, page, pageSize)
  }


  //subscribe hab
  @ApiOperation({ summary: "subscribe hab" })
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribeToHab(@Body() subscribeDto: SubscribeDto){
    return this.habsService.subscribeToHab(subscribeDto);
  }


  //unsubscribe hab
  @ApiOperation({ summary: "unsubscribe hab" })
  @UseGuards(JwtAuthGuard)
  @Post('unsubscribe')
  async unSubscribeToHab(@Body() subscribeDto: SubscribeDto) {
    return this.habsService.unSubscribeToHab(subscribeDto);
  }


  //load hubs subscribed to by the user
  @ApiOperation({ summary: "load hubs subscribed to by the user" })
  @Get('/user/:userId/subscribed-habs')
  async loadUserHabs(@Param('userId') userId: string) {
    return this.habsService.loadUserHabs(Number(userId))
  }


  //load the full list of hubs, to create a post
  @ApiOperation({ summary: "load the full list of hubs, to create a post" })
  @Get('/all/list')
  async getAllHabs() {
    return this.habsService.getAllHabs()
  }


  //load habs by category for sidebar
  @ApiOperation({ summary: "load habs by category for sidebar" })
  @Get('/category/:category')
  async loadHabsByCategory(@Param('category') category: string) {
    return this.habsService.loadHabsByCategory(category)
  }
}
