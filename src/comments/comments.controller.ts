import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Коментарии')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //create comment
  @ApiOperation({ summary: "create comment" })
  @UseGuards(JwtAuthGuard)
  @Post('/create/:postId')
  async createComment(
    @Req() req,
    @Body() CreateCommentDto:CreateCommentDto,
    @Param('postId', ParseIntPipe) postId: number
  ) {
    const { id } = req.user
    return this.commentsService.createComment(postId, id, CreateCommentDto);
  }


  //load comments by postId
  @ApiOperation({ summary: "load comments by postId" })
  @Get('/load/:postId')
  async loadCommentsByPostId(
    @Param('postId', ParseIntPipe) postId: number
  ) {
    return this.commentsService.loadCommentsByPostId(postId);
  }


  //delete comment
  @ApiOperation({ summary: "delete comment" })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:commentId')
  async deleteCommentByCommentId(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
  ) {
    const { id } = req.user
    return this.commentsService.deleteCommentByCommentId(commentId, id);
  }

  //load all user comments
  @ApiOperation({ summary: "load all user comments" })
  @Get('/user/:userId')
  async loadCommentsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,   ) {
    return this.commentsService.loadCommentsByUserId(userId, page, pageSize);
  }


  //load user favorites comments
  @ApiOperation({ summary: "load user favorites comments" })
  @Get('/favorites/:userId')
  loadUserFavoritesComments
    (
      @Param('userId', ParseIntPipe) userId: number,
      @Query('page') page: number,
      @Query('pageSize') pageSize: number,
    ) {
    return this.commentsService.loadUserFavoritesComments(userId, page, pageSize)
  }
}
