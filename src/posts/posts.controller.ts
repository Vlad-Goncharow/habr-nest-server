import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostModel } from './posts.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  
  //Создание поста
  @ApiOperation({ summary: "Создание поста" })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Req() req, @Body() createPostDto: CreatePostDto, @UploadedFile() image) {
    const {id} = req.user
    return this.postsService.create({ ...createPostDto, userId:id }, image);
  }


  //Получение одного поста
  @ApiOperation({summary:'Получение одного поста'})
  @Get('/:postId')
  loadPostById(@Param('postId') postId:string){
    return this.postsService.loadPostById(postId)
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
