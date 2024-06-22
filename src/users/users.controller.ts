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

  //add user role
  @ApiOperation({ summary: "add user role" })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/:userId/role/:roleId/add')
  addRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.usersService.addRole(userId, roleId)
  }


  //remove user role
  @ApiOperation({ summary: "remove user role" })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/:userId/role/:roleId/remove')
  removeRole(@Param('userId') userId:string, @Param('roleId') roleId:string) {
    return this.usersService.removeRole(userId, roleId)
  }


  //load user by id
  @ApiOperation({ summary: "load user by id" })
  @Get('/:userId')
  async getUserById(@Param('userId') userId: string) {
    return this.usersService.getUserById(Number(userId))
  }


  //subscribe
  @ApiOperation({ summary: "subscribe" })
  @UseGuards(JwtAuthGuard)
  @Post('/subscribe/:userId')
  async subscribe(@Req() req, @Param('userId') userId: string) {
    const {id} = req.user
    return this.usersService.subscribe(id, Number(userId))
  }


  //unsubscribe
  @ApiOperation({ summary: "unsubscribe" })
  @UseGuards(JwtAuthGuard)
  @Post('/unsubscribe/:userId')
  async unSubscribe(@Req() req, @Param('userId') userId: string) {
    const { id } = req.user
    return this.usersService.unSubscribe(id, Number(userId))
  }


  //load user subs
  @ApiOperation({ summary: "load user subs" })
  @Get('/subs/:userId/:type')
  async loadUserSubs(
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.usersService.loadUserSubs(Number(userId), type, Number(page), Number(pageSize))
  }


  //load category authors
  @ApiOperation({ summary: "load category authors" })
  @Get('/authors/:category/:nickname')
  loadCategoryAuthors
    (
      @Param('nickname') nickname: string,
      @Param('category') category: string,
      @Query('page') page: number,
      @Query('pageSize') pageSize: number,
      @Query('sort') sort: string,
      @Query('order') order: string,
    ) {
    return this.usersService.loadCategoryAuthors(nickname, category, sort, order, page, pageSize)
  }

  
  //add favorite post
  @ApiOperation({ summary: "add favorite post" })
  @UseGuards(JwtAuthGuard)
  @Post('/favorites/post/add/:postId')
  addFavoritePost
    (
      @Req() req,
      @Param('postId') postId: string,
    ) {
    const { id } = req.user
    return this.usersService.addFavoritePost(Number(id), Number(postId))
  }


  //delete favorite post
  @ApiOperation({ summary: "delete favorite post" })
  @UseGuards(JwtAuthGuard)
  @Post('/favorites/post/delete/:postId')
  removeFavoritePost
    (
      @Req() req,
      @Param('postId') postId: string,
    ) {
    const { id } = req.user
    return this.usersService.removeFavoritePost(Number(id), Number(postId))
  }


  //add favorite comment
  @ApiOperation({ summary: "add favorite comment" })
  @UseGuards(JwtAuthGuard)
  @Post('/favorites/comment/add/:commentId')
  addFavoriteComment
    (
      @Req() req,
      @Param('commentId') commentId: number,
    ) {
    const { id } = req.user
    return this.usersService.addFavoriteComment(Number(id), commentId)
  }


  //remove favorite comment
  @ApiOperation({ summary: "remove favorite comment" })
  @UseGuards(JwtAuthGuard)
  @Post('/favorites/comment/remove/:commentId')
  removeFavoriteComment
    (
      @Req() req,
      @Param('commentId') commentId: number,
    ) {
    const { id } = req.user
    return this.usersService.removeFavoriteComment(Number(id), commentId)
  }
}
