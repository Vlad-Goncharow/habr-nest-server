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


  async loadShortHabById(id:number){
    const hab = await this.habRepository.findByPk(id)
    const posts = await this.habPostsModel.findAndCountAll({
      where: { habId: id },
      include: [{all:true},]
    })
    const authors = await this.habRepository.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'usersSubscribers',
        },
      ]
    })
    return {
      hab,
      posts: posts.count,
      subscribers: authors.usersSubscribers.length
    }
  }

  async loadHabPosts(id: string, page: number, pageSize: number){
    const offset = (page - 1) * pageSize;
    const posts = await this.habPostsModel.findAll({
      where: { habId: id },
      include: [
        {
          model: PostModel,
          include: [
            {
              model: User,
              attributes: ['id', 'avatar', 'nickname']
            },
            {
              model: Hab,
              through: { attributes: [] },
              attributes: ['id', 'title']
            }
          ]
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    return posts.map(habPost => habPost.post);;
  }

  async loadHabAuthors(id:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;
    const authors = await this.habAuthorsModel.findAll({
      where: { habId: id },
      include: [
        {
          model: User,
          attributes: ['id', 'avatar', 'nickname','description']
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    return authors.map(habAuthors => habAuthors.user)
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

  //delete hab author
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
          attributes: ['id', 'title']
        }
      ]
    })

    const habs = data.map((el) => el.hab)

    return habs
  }
}
