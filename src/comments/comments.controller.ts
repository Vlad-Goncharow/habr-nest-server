import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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

  //Создание коментария
  @ApiOperation({ summary: "Создание коментария" })
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

  //Получение коментариев поста
  @ApiOperation({ summary: "Получение коментариев поста" })
  @Get('/load/:postId')
  async loadPostComments(
    @Param('postId') postId: string,
  ) {
    return this.commentsService.loadPostComments(Number(postId));
  }


  //Удаление коментария
  @ApiOperation({ summary: "Удаление коментария" })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/delete/:commentdId')
  async deleteComments(
    @Param('commentdId') commentdId: string,
    @Req() req,
  ) {
    const { id } = req.user
    return this.commentsService.deleteComments(Number(commentdId), id);
  }
}
