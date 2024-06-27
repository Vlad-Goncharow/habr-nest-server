import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { CommentsModel } from './comments.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserFavoriteComments } from 'src/users/user-favorite-comments.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(CommentsModel) private commentsRepository: typeof CommentsModel,
                                          private usersService: UsersService) {}

  //create comment
  async createComment(postId: number, userId:number, CreateCommentDto: CreateCommentDto){
    const data = await this.commentsRepository.create({ ...CreateCommentDto, userId, postId })

    const comment = await this.commentsRepository.findByPk(data.id, {
      include: [
        {
          model: User,
          as:'author',
          attributes: ['id', 'avatar', 'nickname']
        },
      ]
    })

    return comment
  }

  //load comments by postId
  async loadCommentsByPostId(postId:number){
    const comments = await this.commentsRepository.findAll({
      where:{postId},
      include:[
        {
          model: User,
          as: 'author',
          attributes: ['id', 'avatar', 'nickname'],
        }
      ],
      order: [['createdAt', 'asc']]
    })

    return comments
  }

  //delete comment
  async deleteCommentByCommentId(commentId:number, userId:number) {
    const data = await this.commentsRepository.findByPk(commentId)
    const isUserHasRoles = await this.checkUserRoles(userId)

    if (!isUserHasRoles){
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
    }

    if(!data){
      throw new HttpException('Такой коментарий не найден', HttpStatus.NOT_FOUND)
    }

    if (data.userId === userId || isUserHasRoles){
      const favorites = await UserFavoriteComments.findAll({ where: { commentId } });
      const favoriteDeletions = favorites.map(favorite => favorite.destroy());

      await Promise.all(favoriteDeletions);

      await data.destroy();

      return { success: true };
    }
  }

  //load all user comments
  async loadCommentsByUserId(userId:number, page:number, pageSize:number) {
    const offset = (page - 1) * pageSize;

    const {rows,count} = await this.commentsRepository.findAndCountAll({
      where:{userId},
      include:[
        {
          model:User,
          as: 'author',
          attributes: ['id', 'avatar', 'nickname'], 
        },
        {
          model: PostModel,
          attributes: ['id', 'title'],
        }
      ],
      limit: pageSize,
      offset: offset,
    })
    
    return {
      comments:rows,
      length:count
    }
  }

  //load user favorites comments
  async loadUserFavoritesComments(userId:number, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    const {rows,count} = await this.commentsRepository.findAndCountAll({
      include:[
        {
          model: User,
          as: 'favorites',
          where: { id: userId }
        }, {
          model: User,
          as:'author',
          attributes: ['id', 'avatar', 'nickname'],
        }, {
          model: PostModel,
          attributes: ['id', 'title'],
        }
      ],
      limit: pageSize,
      offset: offset,
      distinct: true,
    })

    return {
      comments: rows,
      length: count
    };
  }

  //check user roles | admin | moderator
  async checkUserRoles(userId: number) {
    const user = await this.usersService.loadUserRolesByUserId(userId)

    if (user.roles.some(el => el.value === 'ADMIN' || el.value === 'MODERATOR')) {
      console.log('user.roles', user.roles);
      return true
    } else {
      false
    }
  }
}
