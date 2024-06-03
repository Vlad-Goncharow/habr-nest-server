import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabDto } from './dto/create-hab.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Hab } from './habs.model';
import { PostModel } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { HabPosts } from './hab-posts.model';
import { HabAuthors } from './hab-authors.model';
import { SubscribeDto } from './dto/subscribe-hab.dto';
import { HabSubscribers } from './hab-subscribers.model';
import { Op, Sequelize } from 'sequelize';
import sequelize from 'sequelize';


@Injectable()
export class HabsService {

  constructor(@InjectModel(Hab) private habRepository: typeof Hab, 
  @InjectModel(HabPosts) private habPostsModel: typeof HabPosts,
  @InjectModel(HabAuthors)  private habAuthorsModel: typeof HabAuthors,
  @InjectModel(HabSubscribers) private habSubscribersModel: typeof HabSubscribers){}

  async createHab(createHabDto: CreateHabDto) {
    const findHab = await this.habRepository.findOne({where:{title:createHabDto.title}})

    if(findHab){
      throw new HttpException('Хаб с таким названием уже существует', HttpStatus.BAD_REQUEST)
    }

    const hab = await this.habRepository.create(createHabDto)

    return hab
  }

  async getHabs(hubIds: number[]){
    const selectedHubs = await this.habRepository.findAll({
      where: {
        id: hubIds
      }
    });

    return selectedHubs
  }

  async loadHabById(id:number){
    const hab = await this.habRepository.findByPk(Number(id))

    return hab
  }

  async loadHabsByValues(category: string, title:string, sort:string, order:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    const myWhere = () => {
      if(category === 'all'){
        if(title === 'all'){
          return {};
        } else{
          return {
            title: { [Op.like]: `%${title}%` } 
          }
        }
      } else{
        if(title === 'all'){
          return {
            category
          }
        } else {
          return {
            category, 
            title: { [Op.like]: `%${title}%`} 
          }
        }
      }
    }
    let myOrder = [];
    
    if(sort === 'subs' || sort === 'rating' && order === 'asc' || order === 'desc'){
      myOrder = [[
        sort === 'subs' ? 'usersSubscribersCount' : 'rating',
        order.toUpperCase()
      ]]
    }

    const { rows, count } = await this.habRepository.findAndCountAll({
      where: myWhere(),
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_subscribers" WHERE "hab_subscribers"."habId" = "Hab"."id")'),
            'usersSubscribersCount',
          ],
        ],
      },
      order: myOrder,
      limit: pageSize,
      offset: offset,
    })

    return {
      habs: rows,
      length: count
    };
  }

  async searchHabs(title, page, pageSize,sort, order){
    const offset = (page - 1) * pageSize;

    let myOrder = [];

    if (sort === 'subs' || sort === 'rating' && order === 'asc' || order === 'desc') {
      myOrder = [[
        sort === 'subs' ? 'usersSubscribersCount' : 'rating',
        order.toUpperCase()
      ]]
    }

    const {rows, count} = await this.habRepository.findAndCountAll({
      where: { title: { [Op.like]: `%${title}%` } },
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_subscribers" WHERE "hab_subscribers"."habId" = "Hab"."id")'),
            'usersSubscribersCount',
          ],
        ],
      },
      order: myOrder,
      limit: pageSize,
      offset: offset,
    })

    return {
      habs: rows,
      length: count
    };
  }

  async loadHabAuthors(id:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    const {count, rows} = await this.habAuthorsModel.findAndCountAll({
      where: { habId: id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        },
      ],
      limit: pageSize,
      offset: offset,
      distinct: true,
    });

    return {
      users: rows.map(habAuthors => habAuthors.user),
      length:count
    }
  }

  async subscribeToHab(dto: SubscribeDto){
    const hab = await this.loadHabById(Number(dto.habId))
    if (!hab) {
      throw new NotFoundException('Хаб не найден');
    }


    const isSubscribed = await this.habSubscribersModel.findOne({
      where: { userId:dto.userId, habId:dto.habId },
    });

    if (isSubscribed) {
      throw new BadRequestException('Пользователь уже подписан на этот хаб');
    }

    await this.habSubscribersModel.create({ userId: dto.userId, habId: Number(dto.habId) });
    return {
      success: true
    }
  }

  async unSubscribeToHab(dto: SubscribeDto) {
    const hab = await this.loadHabById(Number(dto.habId))
    if (!hab) {
      throw new NotFoundException('Хаб не найден');
    }

    const isSubscribed = await this.habSubscribersModel.findOne({
      where: { userId: dto.userId, habId: dto.habId },
    });

    if (!isSubscribed) {
      throw new BadRequestException('Пользователь не подписан на этот хаб');
    }

    await isSubscribed.destroy()
    return {
      success:true
    }
  }

  async deleteAuthorInHabAuthors(userId: number, habId: number){
    const hab = await this.loadHabById(habId)
    
    if(hab){
      await hab.$remove('author', userId)
    }
    // const author = await this.habAuthorsModel.findOne({ where: { userId, habId} })
    
    // if (!author) {
    //   throw new HttpException('Такого поста в хабе не существует', HttpStatus.NOT_FOUND)
    // }

    // author.destroy()
  }

  async loadUserHabs(userId:number){
    const data = await this.habSubscribersModel.findAll({
      where:{userId},
      include:[
        {
          model: Hab,
        }
      ]
    })

    const habs = data.map((el) => el.hab)

    const details = await Promise.all(habs.map(async (hab) => {
      const postsCount = await this.habPostsModel.count({
        where: { habId: hab.id },
      });

      const subscribersCount = await this.habSubscribersModel.count({
        where: { habId: hab.id },
      });
      return {
        hab,
        posts: postsCount,
        subscribers: subscribersCount
      }
    }))

    return details
  }

  async getAllHabs(){
    const habs = await this.habRepository.findAll({
      attributes: ['id', 'title'],
    })

    return habs
  }
}
