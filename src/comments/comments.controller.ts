import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
    @Param('postId') postId: string,
  ) {
    const { id } = req.user
    return this.commentsService.createComment(Number(postId), id, CreateCommentDto);
  }

  //load comments by postId
  @ApiOperation({ summary: "load comments by postId" })
  @Get('/load/:postId')
  async loadCommentsByPostId(
    @Param('postId') postId: string,
  ) {
    return this.commentsService.loadCommentsByPostId(Number(postId));
  }


  //delete comment
  @ApiOperation({ summary: "delete comment" })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/delete/:commentdId')
  async deleteCommentByCommentId(
    @Param('commentdId') commentdId: string,
    @Req() req,
  ) {
    const { id } = req.user
    return this.commentsService.deleteCommentByCommentId(Number(commentdId), id);
  }


  //load all user comments
  @ApiOperation({ summary: "load all user comments" })
  @Get('/user/:userId')
  async loadCommentsByUserId(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,   ) {
    return this.commentsService.loadCommentsByUserId(Number(userId), page, pageSize);
  }
}
