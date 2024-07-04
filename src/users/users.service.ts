import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateProfileDto } from 'src/auth/dto/UpdateProfileDto';
import { Hab } from 'src/habs/habs.model';
import { PostModel } from 'src/posts/posts.model';
import { Role } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFavoritePosts } from './user-favorite-posts.model';
import { UserSubscriptions } from './user-subscriptions-model';
import { User } from './users.model';
import { UserFavoriteComments } from './user-favorite-comments.model';
import { CommentsModel } from 'src/comments/comments.model';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User) private userRepository: typeof User,
                                 private roleService: RolesService){}

  //create new user
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValye("USER");

    await user.$set('roles', [role.id]);
    user.roles = [role];

    const userWithoutPassword = await this.userRepository.findByPk(user.id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'value', 'description', 'createdAt', 'updatedAt'],
        },
      ],
      attributes: { exclude: ['password'] },
    });

    return userWithoutPassword;
  }

  //add user new role
  async addRole(userId: string, roleId: string) {
    const user = await this.userRepository.findByPk(userId)
    const role = await this.roleService.getRoleById(roleId)

    if (role && user) {
      await user.$add('role', role.id)
      return role
    }

    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
  }

  //remove user role
  async removeRole(userId:string, roleId:string) {
    const user = await this.userRepository.findByPk(userId)
    const role = await this.roleService.getRoleById(roleId)

    if (role && user) {
      await user.$remove('role', role.id)
      return role
    }

    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
  }

  //load user by id
  async getUserById(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'subscribers',
          through: { attributes: [] },
          attributes: ['id'],
        },
        {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id']
        }
      ]
    })

    if (!user) {
      throw new HttpException('Данный пользователь не найден', HttpStatus.NOT_FOUND)
    }

    return user
  }
 
  //subscribe
  async subscribe(id:number, userId:number){
    const subscription = await UserSubscriptions.findOne({
      where: {
        subscriberId: id,
        subscriptionId: userId,
      },
    });

    if (subscription){
      throw new HttpException('Уже подписан', HttpStatus.BAD_REQUEST)
    }

    await UserSubscriptions.create({
      subscriberId: id,
      subscriptionId: userId,
    });

    const user2 = await User.findByPk(userId);
    if (user2) {
      await user2.$add('subscribers', id); 
    }

    const user1 = await User.findByPk(id);
    if (user1) {
      await user1.$add('subscriptions', userId); 
    }
    
    return {
      success: true
    }
  }

  //unsubscribe
  async unSubscribe(id:number, userId:number){
    const subscription = await UserSubscriptions.findOne({
      where: {
        subscriberId:id,
        subscriptionId: userId,
      },
    });

    if (!subscription) {
      throw new HttpException('Подписка не найдена', HttpStatus.NOT_FOUND)
    }

    await UserSubscriptions.destroy({
      where: {
        subscriberId: id,
        subscriptionId: userId,
      },
    });

    return {
      success:true
    }
  }

  //load user subs
  async loadUserSubs(userId:number, type:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    const whereType = type === 'subscriptions' ? { subscriberId: userId } : (type === 'subscribers' ? { subscriptionId: userId } : null);

    const { count } = await UserSubscriptions.findAndCountAll({
      where: whereType,
    });

    const user1 = await UserSubscriptions.findAll({ 
      where: whereType, 
      include:[
        {
          model: User,
          as: type, // Подписчики
          attributes: { exclude: ['password'] }
        },
      ],
      limit: pageSize,
      offset: offset,
    })

    return {
      length:count,
      [type]: user1.map(el => el[type])
    }
  }

  //load category authors
  async loadCategoryAuthors(nickname:string, category:string, sort:string, order:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    const myWhere = category === 'all' ? {} : {category}
    const userWHre = nickname === ' ' ? {} : {nickname:{ [Op.like]: `%${nickname}%` }}

    let myOrder = [];
    if ((sort === 'karma' || sort === 'rating') && (order === 'asc' || order === 'desc')) {
      myOrder = [[sort === 'rating' ? 'rating' : 'karma', order.toUpperCase()]];
    }

    const {count,rows} = await this.userRepository.findAndCountAll({
      where: userWHre,
      include: [
        {
          model: PostModel,
          as:'posts',
          where: myWhere,
          attributes:[],
        }
      ],
      attributes: { exclude: ['password'] },
      limit: pageSize,
      order: myOrder,
      offset: offset,
      distinct:true,
    });
    
    return {
      length:count,
      authors:rows
    }
  }

  //add favorite post
  async addFavoritePost(userId:number, postId:number){
    const post = await PostModel.findByPk(postId)

    if(!post){
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND)
    }

    const data = await UserFavoritePosts.findOne({
      where: {
        userId,
        postId
      }
    })

    if (data) {
      throw new HttpException('Уже в избранном', HttpStatus.BAD_REQUEST)
    }

    await UserFavoritePosts.create({ userId, postId })

    return {
      success: true
    }
  }

  //delete favorite post
  async removeFavoritePost(userId:number, postId:number){
    const post = await PostModel.findByPk(postId)

    if(!post){
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND)
    }

    const data = await UserFavoritePosts.findOne({
      where: {
        userId,
        postId
      }
    })

    if (!data) {
      throw new HttpException('Такого поста нет в избранном', HttpStatus.BAD_REQUEST)
    }
    
    await UserFavoritePosts.destroy({
      where: {
        userId,
        postId
      }
    })

    return {
      success:true
    }
  }

  //add favorite comment
  async addFavoriteComment(userId:number, commentId:number){
    const comment = await CommentsModel.findByPk(commentId)

    if(!comment){
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND)
    }

    const isCommentFavorite = await UserFavoriteComments.findOne({
      where:{
        userId,
        commentId
      }
    })

    if (isCommentFavorite) {
      throw new HttpException('Уже в избранном', HttpStatus.BAD_REQUEST)
    }

    await UserFavoriteComments.create({ userId, commentId })

    return {
      success: true
    }
  }

  //remove favorite comment
  async removeFavoriteComment(userId: number, commentId: number) {
    const comment = await CommentsModel.findByPk(commentId)

    if (!comment) {
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND)
    }

    const isCommentFavorite = await UserFavoriteComments.findOne({
      where: {
        userId,
        commentId
      }
    })

    if (!isCommentFavorite) {
      throw new HttpException('Такого поста нет в избранном', HttpStatus.BAD_REQUEST)
    }

    await UserFavoriteComments.destroy({
      where: {
        userId,
        commentId
      }
    })

    return {
      success: true
    }
  }

  

  //load user by email
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    return user
  }

  //load user by nickname
  async getUserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({ where: { nickname } })

    return user
  }

  //update profile
  async updateProfile(id: number, dto: UpdateProfileDto) {
    return this.userRepository.update(dto, { where: { id } })
  }

  //load current user
  async loadCurrentUserById(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include: [
        {
          through: { attributes: [] },
          association: 'roles',
          attributes: ['id', 'value']
        },{
          through: { attributes: [] },
          association: 'subscribers',
          attributes: ['id']
        },{
          through: { attributes: [] },
          association: 'subscriptions',
          attributes: ['id']
        },{
          through: { attributes: [] },
          association: 'habSubscribers',
          attributes: ['id']
        }, {
          through: { attributes: [] },
          association: 'favoritePosts',
          attributes: ['id']
        }, {
          through: { attributes: [] },
          association: 'favoriteComments',
          attributes: ['id']
        }
      ]
    })

    if (!user) {
      throw new HttpException('Данный пользователь не найден', HttpStatus.NOT_FOUND)
    }

    return user
  }

  //check user roles | admin | moderator
  async checkUserRoles(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include: [
        {
          through: { attributes: [] },
          association: 'roles',
          attributes: ['id', 'value']
        }
      ]
    })

    if (!user) {
      throw new HttpException('Данный пользователь не найден', HttpStatus.NOT_FOUND)
    }

    if (user.roles.some(el => el.value === 'ADMIN' || el.value === 'MODERATOR')) {
      return true
    } else {
      false
    }
  }
}
