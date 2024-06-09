import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  //Популярные посты за неделю
  @ApiOperation({ summary: 'Популярные посты за неделю' })
  @Get('/weekly/:category')
  loadWeeklyPosts(
    @Param('category') category: string,
  ) {
    return this.postsService.loadWeeklyPosts(category)
  }
  
  //Создание поста
  @ApiOperation({ summary: "Создание поста" })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createPostDto: CreatePostDto, ) {
    const {id} = req.user
    return this.postsService.create({ ...createPostDto, userId:id });
  }


  //Получение одного поста
  @ApiOperation({summary:'Получение одного поста'})
  @Get('/:postId')
  loadPostById(@Param('postId') postId:number){
    return this.postsService.loadPostById(postId)
  }


  //Пойск постов по названия
  @ApiOperation({ summary: 'Пойск постов по названия' })
  @Get('/search/:title')
  seachPosts(
    @Param('title') title: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.seachPosts(title, Number(page), Number(pageSize))
  }


  //Получение постов
  @ApiOperation({ summary: 'Получение постов' })
  @Get('/:category/:type')
  loadPosts(
    @Param('category') category: string, 
    @Param('type') type: string, 
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,){
    return this.postsService.loadPosts(category, type, Number(page), Number(pageSize))
  }

  //Удаление поста
  @ApiOperation({ summary: 'Удаление поста' })
  @Roles('MODERATOR')
  @UseGuards(RolesGuard)
  @Post('/delete/:postId')
  delePostById(@Param('postId') postId:string){
    return this.postsService.delePostById(postId)
  }


  //Получение постов юзера
  @ApiOperation({ summary: 'Получение постов юзера' })
  @Get('/user/:userId/:type')
  loadUserPosts(
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.loadUserPosts(Number(userId), type, Number(page), Number(pageSize))
  }



  //Получение посто хаба
  @ApiOperation({ summary: 'Получение посто хаба' })
  @Get('/hab/:habId/:type')
  loadHabPosts(
    @Param('habId') habId: string,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.loadHabPosts(Number(habId), type, Number(page), Number(pageSize))
  }


  
}
