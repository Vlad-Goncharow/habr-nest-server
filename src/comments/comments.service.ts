import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CommentsModel } from './comments.model';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/users.model';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(CommentsModel) private commentsRepository: typeof CommentsModel,
                                          private postService:PostsService) {}

    
  async createComment(postId: number, userId:number, CreateCommentDto: CreateCommentDto){
    const data = await this.commentsRepository.create({ ...CreateCommentDto, userId, postId })
    const post = await this.postService.loadPostById(Number(postId))
    await post.$add('comments', data)

    const comment = await this.commentsRepository.findByPk(data.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'avatar', 'nickname']
        },
      ]
    })

    return comment
  }

  async loadPostComments(postId:number){
    const comments = await this.commentsRepository.findAll({
      where:{postId},
      include:[
        {
          model: User,
          attributes: ['id', 'avatar', 'nickname']
        },
      ]
    })

    return comments
  }

  async deleteComments(commentdId:number, userId:number) {
    const data = await this.commentsRepository.findByPk(commentdId)
    
    if(data && data.userId === userId){
      data.destroy()

      return{
        success:true
      }
    } else{
      throw new HttpException('Такой коментарий не найден', HttpStatus.NOT_FOUND)
    }
  }
}
