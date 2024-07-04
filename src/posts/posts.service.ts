import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';
import { CommentsModel } from 'src/comments/comments.model';
import { Hab } from 'src/habs/habs.model';
import { HabsService } from 'src/habs/habs.service';
import { User } from 'src/users/users.model';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './posts.model';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class PostsService {

  constructor(@InjectModel(PostModel) private postRepository: typeof PostModel,
                                      private usersService: UsersService,
                                      private habsService:HabsService,
                                      private commentsService: CommentsService){}

  //create post                                 
  async create(dto: CreatePostDto) {
    //create post & get habs by ids
    const post = await this.postRepository.create({ ...dto});
    const habs = await this.habsService.getHabs(dto.habs);

    //add habs in post
    await post.$add('habs', habs);

    //add post&user in hab (posts, authors)
    for (const hab of habs) {
      await hab.$add('posts', post);
      await hab.$add('authors', dto.userId);
    }

    //return post, in front navigate to post page by postID
    return post
  }

  //load single post
  async loadPostById(postId:number){
    const post = await this.postRepository.findByPk(postId, {
      include:[
        {
          model: User,
          as:'author',
          attributes: ['id', 'avatar', 'nickname', 'rating', 'karma'], 
          include: [
            {
              model: User, 
              as: 'subscribers', 
              through: { attributes: [] },
              attributes: ['id'], 
            }
          ]
        },
        {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
      ]
    })

    if(!post){
      throw new HttpException('Такого поста не существует', HttpStatus.NOT_FOUND)
    }

    post.views = post.views + 1
    post.save()

    return post
  }

  //load posts(main page)
  async loadPosts(category: string, type: string, page: number, pageSize){
    const offset = (page - 1) * pageSize;
    const myWhere = category === 'all' ? {type} : {category, type}
    
    const { count, rows } = await this.postRepository.findAndCountAll({
      where: myWhere,
      include: [
        {
          model: User,
          as:'author',
          attributes: ['id', 'avatar', 'nickname']
        },{
          model: CommentsModel,
          attributes: ['id',]
        },
        {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "user_favorite_posts"
              WHERE "user_favorite_posts"."postId" = "PostModel"."id"
            )`),
            'favoritesCount'
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM "comments"
            WHERE "comments"."postId" = "PostModel"."id"
          )`),
            'commentsCount'
          ]
        ]
      },
      limit: pageSize,
      offset: offset,
      distinct: true,
    });
    
    return {
      posts: rows,
      length:count
    };
  }

  //delete post
  async delePostById(postId:number, userId:number){
    const post = await this.postRepository.findByPk(postId)
    const isUserHasRoles = await this.usersService.checkUserRoles(userId)

    if(!post){
      throw new HttpException('Такого поста не существует', HttpStatus.NOT_FOUND)
    }

    if(post.userId === userId || isUserHasRoles){
      await this.commentsService.deleteAllCommentsByPostId(postId)
      post.destroy()

      return {
        success: true
      }
    }

    if (!isUserHasRoles) {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
    }
  }

  //load user posts
  async loadUserPosts(userId:number, type:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;

    const { count, rows } = await this.postRepository.findAndCountAll({
      where: { userId, type },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'avatar', 'nickname']
        },
        {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "user_favorite_posts"
              WHERE "user_favorite_posts"."postId" = "PostModel"."id"
            )`),
            'favoritesCount'
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM "comments"
            WHERE "comments"."postId" = "PostModel"."id"
          )`),
            'commentsCount'
          ]
        ]
      },
      limit: pageSize,
      offset: offset,
      distinct: true,
    });
    
    return {
      posts: rows,
      length: count
    };
  }

  //load hab posts
  async loadHabPosts(habId: number, type: string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;

    const {rows, count} = await this.postRepository.findAndCountAll({
      where:{type},
      include:[
        {
          model:Hab,
          where:{id:habId},
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
        {
          model: User,
          as:'author',
          attributes: ['id', 'avatar', 'nickname']
        },
      ], 
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "user_favorite_posts"
              WHERE "user_favorite_posts"."postId" = "PostModel"."id"
            )`),
            'favoritesCount'
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM "comments"
            WHERE "comments"."postId" = "PostModel"."id"
          )`),
            'commentsCount'
          ]
        ]
      },
      limit: pageSize,
      offset: offset,
      distinct: true,
    })

    return {
      posts: rows,
      length: count
    };
  }

  //search posts
  async seachPosts(title:string, page:number, pageSize:number){
    const offset = (page - 1) * pageSize;
    
    const { count, rows } = await this.postRepository.findAndCountAll({
      where: { title: { [Op.like]: `%${title}%` } },
      include: [
        {
          model: User,
          as:'author',
          attributes: ['id', 'avatar', 'nickname']
        },
        {
          model: CommentsModel,
          attributes: ['id',]
        },
        {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "user_favorite_posts"
              WHERE "user_favorite_posts"."postId" = "PostModel"."id"
            )`),
            'favoritesCount'
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM "comments"
            WHERE "comments"."postId" = "PostModel"."id"
          )`),
            'commentsCount'
          ]
        ]
      },
      limit: pageSize,
      offset: offset,
      distinct: true,
    });

    return {
      posts: rows,
      length: count
    };
  }

  //load weekly posts on sidebar
  async loadWeeklyPosts(category:string){
    const whereCategory = category !== 'all' ? { category } : {}
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const posts = await this.postRepository.findAll({
      where: [
        whereCategory,
        {
          createdAt: {
            [Op.gte]: oneWeekAgo
          }
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "user_favorite_posts"
              WHERE "user_favorite_posts"."postId" = "PostModel"."id"
            )`),
            'favoritesCount'
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM "comments"
            WHERE "comments"."postId" = "PostModel"."id"
          )`),
            'commentsCount'
          ]
        ]
      },
      order:[
        ['views','desc']
      ],
      limit:6
    })

    return posts
  }

  //load user favorites posts
  async loadUserFavoritesPosts(userId: number,type:string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;

    const {rows, count} = await this.postRepository.findAndCountAll({
      where:{type},
      include:[
        {
          model: User,
          as: 'author',
          attributes: ['id', 'avatar', 'nickname']
        },{
          model: User,
          as:'favorites',
          where:{id:userId}
        }, {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "user_favorite_posts"
              WHERE "user_favorite_posts"."postId" = "PostModel"."id"
            )`),
            'favoritesCount'
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM "comments"
            WHERE "comments"."postId" = "PostModel"."id"
          )`),
            'commentsCount'
          ]
        ]
      },
      limit: pageSize,
      offset: offset,
      distinct: true,
    })
    return {
      posts: rows,
      length: count
    };
  }
}
