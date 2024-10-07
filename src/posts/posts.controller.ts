import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsUtilService } from './types';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(
    @Inject('POSTS_UTIL_SERVICE') private readonly postsService: PostsUtilService,
  ) {}
    
  @ApiOperation({ summary: "create post" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createPostDto: CreatePostDto, ) {
    const {id} = req.user
    const post = await this.postsService.createPost(createPostDto, id);
    return post
  }


  @ApiOperation({summary:'load single post'})
  @ApiParam({ name: 'postId', example: '1', description: 'ИД поста' })
  @Get('/:postId')
  async loadPostById(@Param('postId', ParseIntPipe) postId: number){
    const post = await this.postsService.loadPostById(postId)
    return post
  }


  @ApiOperation({ summary: 'search posts' })
  @ApiParam({ name: 'title', example: 'title 1', description: 'Название поста для поиска' })
  @ApiQuery({ name: 'page', example: 1, description: 'Номер страницы', required: true })
  @ApiQuery({ name: 'pageSize', example: 10, description: 'Количество постов на странице', required: true })
  @Get('/search/:title')
  seachPosts(
    @Param('title') title: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.seachPosts(title, Number(page), Number(pageSize))
  }


  @ApiOperation({ summary: 'load weekly posts on sidebar' })
  @ApiParam({ name: 'category', description: 'Название категории для получения недельных постов', enum:['develop','admin','management','marketing','popsci'] })
  @Get('/weekly/:category')
  loadWeeklyPosts(@Param('category') category: string,) {
    return this.postsService.loadWeeklyPosts(category)
  }


  @ApiOperation({ summary: 'load posts(main page)' })
  @ApiParam({ name: 'category', description: 'Название категории для получения недельных постов', enum:['develop','admin','management','marketing','popsci'] })
  @ApiParam({ name: 'type', description: 'Тип публикации', enum:['articles','posts','news'] })
  @ApiQuery({ name: 'page', example: 1, description: 'Номер страницы',  })
  @ApiQuery({ name: 'pageSize', example: 10, description: 'Количество постов на странице',  })
  @Get('/:category/:type')
  loadPosts(
    @Param('category') category: string, 
    @Param('type') type: string, 
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,){
    return this.postsService.loadPosts(category, type, Number(page), Number(pageSize))
  }

  @ApiOperation({ summary: 'delete post' })
  @ApiParam({ name: 'postId', description: 'ID поста'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:postId')
  delePostById(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req,
  ){
    const { id } = req.user
    return this.postsService.delePostById(postId, id)
  }


  @ApiOperation({ summary: 'load user posts' }) 
  @ApiParam({ name: 'userId', description: 'ID пользователя', example:1})
  @ApiParam({ name: 'type', description: 'Тип публикации', enum:['articles','posts','news'] })
  @ApiQuery({ name: 'page', example: 1, description: 'Номер страницы',  })
  @ApiQuery({ name: 'pageSize', example: 10, description: 'Количество постов на странице',  })
  @Get('/user/:userId/:type')
  loadUserPosts(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.loadUserPosts(userId, type, Number(page), Number(pageSize))
  }


  @ApiOperation({ summary: 'load hab posts' })
  @ApiParam({ name: 'habId', description: 'ID хаба', example:1})
  @ApiParam({ name: 'type', description: 'Тип публикации', enum:['articles','posts','news'] })
  @ApiQuery({ name: 'page', example: 1, description: 'Номер страницы',  })
  @ApiQuery({ name: 'pageSize', example: 10, description: 'Количество постов на странице',  })
  @Get('/hab/:habId/:type')
  loadHabPosts(
    @Param('habId', ParseIntPipe) habId: number,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.loadHabPosts(habId, type, Number(page), Number(pageSize))
  }


  @ApiOperation({ summary: "load user favorites posts" })
  @ApiParam({ name: 'userId', description: 'ID юзера', example:1})
  @ApiParam({ name: 'type', description: 'Тип публикации', enum:['articles','posts','news'] })
  @ApiQuery({ name: 'page', example: 1, description: 'Номер страницы',  })
  @ApiQuery({ name: 'pageSize', example: 10, description: 'Количество постов на странице',  })
  @Get('/favorites/:type/:userId')
  loadUserFavoritesPosts
    (
      @Param('type') type: string,
      @Param('userId', ParseIntPipe) userId: number,
      @Query('page') page: number,
      @Query('pageSize') pageSize: number,
    ) {
    return this.postsService.loadUserFavoritesPosts(userId, type, page, pageSize)
  }
}
