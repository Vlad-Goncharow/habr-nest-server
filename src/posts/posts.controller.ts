import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
  @Get('/:category/:type/:page')
  loadPosts(@Param('category') category: string, @Param('type') type: string, @Param('page') page: string,){
    return this.postsService.loadPosts(category, type, Number(page))
  }

  //Удаление поста
  @ApiOperation({ summary: 'Удаление поста' })
  @Roles('MODERATOR')
  @UseGuards(RolesGuard)
  @Post('/delete/:postId')
  delePostById(@Param('postId') postId:string){
    return this.postsService.delePostById(postId)
  }
}
