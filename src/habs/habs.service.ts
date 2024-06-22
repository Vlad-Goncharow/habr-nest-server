import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';
import { User } from 'src/users/users.model';
import { CreateHabDto } from './dto/create-hab.dto';
import { SubscribeDto } from './dto/subscribe-hab.dto';
import { HabAuthors } from './hab-authors.model';
import { HabPosts } from './hab-posts.model';
import { HabSubscribers } from './hab-subscribers.model';
import { Hab } from './habs.model';


@Injectable()
export class HabsService {

  constructor(@InjectModel(Hab) private habRepository: typeof Hab, 
  @InjectModel(HabPosts) private habPostsModel: typeof HabPosts,
  @InjectModel(HabAuthors)  private habAuthorsModel: typeof HabAuthors,
  @InjectModel(HabSubscribers) private habSubscribersModel: typeof HabSubscribers){}

  //create hab
  async createHab(createHabDto: CreateHabDto) {
    const findHab = await this.habRepository.findOne({where:{title:createHabDto.title}})

    if(findHab){
      throw new HttpException('Хаб с таким названием уже существует', HttpStatus.BAD_REQUEST)
    }

    const hab = await this.habRepository.create(createHabDto)

    return hab
  }

  //load single hab data
  async loadHabById(id:number){
    const hab = await this.habRepository.findByPk(Number(id))

    return hab
  }

  //load habs by category | title, main page, search page
  async loadHabsByValues(category: string, title: string, sort: string, order: string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;

    const myWhere = () => {
      return {
        ...(category !== 'all' && { category }),
        ...(title.trim() !== '' && { title: { [Op.like]: `%${title}%` } })
      };
    };

    let myOrder = [];
    if ((sort === 'subs' || sort === 'rating') && (order === 'asc' || order === 'desc')) {
      myOrder = [[sort === 'subs' ? 'usersSubscribersCount' : 'rating', order.toUpperCase()]];
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
    });

    return {
      habs: rows,
      length: count
    };
  }

  //load hab authors
  async loadHabAuthors(id:string,sort:string, order:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    let myOrder = [];
    if ((sort === 'karma' || sort === 'rating') && (order === 'asc' || order === 'desc')) {
      myOrder = [[sort === 'rating' ? 'rating' : 'karma', order.toUpperCase()]];
    }

    const {count, rows} = await this.habAuthorsModel.findAndCountAll({
      where: { habId: id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        },
      ],
      limit: pageSize,
      order: myOrder,
      offset: offset,
      distinct: true,
    });

    return {
      users: rows.map(habAuthors => habAuthors.user),
      length:count
    }
  }

  //subscribe hab
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

  //unsubscribe hab
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

  //delete single author in hab authors
  async deleteAuthorInHabAuthors(userId: number, habId: number){
    const hab = await this.loadHabById(habId)
    
    if(hab){
      await hab.$remove('author', userId)
    }
  }

  //load hubs subscribed to by the user
  async loadUserHabs(userId: number) {
    const data = await this.habRepository.findAll({
      include: [
        {
          model: User,
          as:"usersSubscribers",
          where: { id:userId },
          attributes: []
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_subscribers" WHERE "hab_subscribers"."habId" = "Hab"."id")'),
            'subscribersCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_posts" WHERE "hab_posts"."habId" = "Hab"."id")'),
            'postsCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_authors" WHERE "hab_authors"."habId" = "Hab"."id")'),
            'authorsCount'
          ]
        ]
      }
    });

    return data;
  }

  //load the full list of hubs, to create a post
  async getAllHabs(){
    const habs = await this.habRepository.findAll({
      attributes: ['id', 'title'],
    })

    return habs
  }

  //load habs by category for sidebar
  async loadHabsByCategory(category:string){
    const habs = await this.habRepository.findAll({
      where:{category},
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_subscribers" WHERE "hab_subscribers"."habId" = "Hab"."id")'),
            'subscribersCount',
          ], [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_posts" WHERE "hab_posts"."habId" = "Hab"."id")'),
            'postsCount',
          ], [
            sequelize.literal('(SELECT COUNT(*) FROM "hab_authors" WHERE "hab_authors"."habId" = "Hab"."id")'),
            'authorsCount',
          ],
        ],
      },
      limit: 10,
    })

    return habs
  }


  //find habs array by ids
  async getHabs(hubIds: number[]) {
    const selectedHubs = await this.habRepository.findAll({
      where: {
        id: hubIds
      }
    });

    return selectedHubs
  }
}
