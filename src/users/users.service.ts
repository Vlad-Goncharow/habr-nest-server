import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hab } from 'src/habs/habs.model';
import { PostModel } from 'src/posts/posts.model';
import { Role } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UserSubscriptions } from './user-subscriptions-model';
import { PostsService } from 'src/posts/posts.service';

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

  //load user by email
  async getUserByEmail(email:string){
    const user = await this.userRepository.findOne({where: {email}})

    return user
  }

  //load user by nickname
  async getUserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({ where: { nickname }})

    return user
  }

  //load current user
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
          attributes: ['id', 'title']
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

  //load current user
  async loadCurrentUserById(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include:[
        {
          model:User,
          through:{attributes:[]},
          as:'subscribers',
          attributes:['id']
        },
        {
          model: User,
          through: { attributes: [] },
          as: 'subscriptions',
          attributes: ['id']
        },
        {
          model: Hab,
          through: { attributes: [] },
          as: 'habSubscribers',
          attributes: ['id']
        }
      ]
    })

    if (!user) {
      throw new HttpException('Данный пользователь не найден', HttpStatus.NOT_FOUND)
    }

    return user
  }
}
