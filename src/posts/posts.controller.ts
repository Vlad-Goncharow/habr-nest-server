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
    
  //create post
  @ApiOperation({ summary: "create post" })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createPostDto: CreatePostDto, ) {
    const {id} = req.user
    return this.postsService.create({ ...createPostDto, userId:id });
  }


  //load single post
  @ApiOperation({summary:'load single post'})
  @Get('/:postId')
  loadPostById(@Param('postId') postId:number){
    return this.postsService.loadPostById(postId)
  }


  //search posts
  @ApiOperation({ summary: 'search posts' })
  @Get('/search/:title')
  seachPosts(
    @Param('title') title: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.seachPosts(title, Number(page), Number(pageSize))
  }


  //load weekly posts on sidebar
  @ApiOperation({ summary: 'load weekly posts on sidebar' })
  @Get('/weekly/:category')
  loadWeeklyPosts(@Param('category') category: string,) {
    return this.postsService.loadWeeklyPosts(category)
  }


  //load posts(main page)
  @ApiOperation({ summary: 'load posts(main page)' })
  @Get('/:category/:type')
  loadPosts(
    @Param('category') category: string, 
    @Param('type') type: string, 
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,){
    return this.postsService.loadPosts(category, type, Number(page), Number(pageSize))
  }

  //delete post
  @ApiOperation({ summary: 'delete post' })
  @Roles('MODERATOR')
  @UseGuards(RolesGuard)
  @Post('/delete/:postId')
  delePostById(@Param('postId') postId:string){
    return this.postsService.delePostById(postId)
  }


  //load user posts
  @ApiOperation({ summary: 'load user posts' })
  @Get('/user/:userId/:type')
  loadUserPosts(
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.loadUserPosts(Number(userId), type, Number(page), Number(pageSize))
  }


  //load hab posts
  @ApiOperation({ summary: 'load hab posts' })
  @Get('/hab/:habId/:type')
  loadHabPosts(
    @Param('habId') habId: string,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,) {
    return this.postsService.loadHabPosts(Number(habId), type, Number(page), Number(pageSize))
  }


  //load user favorites posts
  @ApiOperation({ summary: "load user favorites posts" })
  @Get('/favorites/:type/:userId')
  loadUserFavoritesPosts
    (
      @Param('type') type: string,
      @Param('userId') userId: number,
      @Query('page') page: number,
      @Query('pageSize') pageSize: number,
    ) {
    return this.postsService.loadUserFavoritesPosts(userId, type, page, pageSize)
  }
}
