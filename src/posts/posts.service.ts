import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from './posts.model';
import { HabsService } from 'src/habs/habs.service';
import { Hab } from 'src/habs/habs.model';
import { User } from 'src/users/users.model';
import { FilesService } from 'src/files/files.service';
import { Op } from 'sequelize';

@Injectable()
export class PostsService {

  constructor(@InjectModel(PostModel) private postRepository: typeof PostModel,
                                      private habsService:HabsService,
                                      private fileService: FilesService){}

  async create(dto: CreatePostDto, image:any) {
    //create post & get habs by ids
    const fileName = await this.fileService.createFile(image)
    const post = await this.postRepository.create({ ...dto, image:fileName });
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

  async loadPostById(postId:string){
    const post = await this.postRepository.findByPk(postId, {
      include:[
        {
          model: User,
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


  async loadPosts(category: string, type: string, page: number, pageSize){
    const offset = (page - 1) * pageSize;

    const { count } = await this.postRepository.findAndCountAll({
      where: { category, type },
    });

    const postsWithInclude = await this.postRepository.findAll({
      where: { category, type },
      include: [
        {
          model: User,
          attributes: ['id', 'avatar', 'nickname']
        },
        {
          model: Hab,
          through: { attributes: [] },
          attributes: ['id', 'title']
        },
      ],
      limit: pageSize,
      offset: offset,
    });
    return {
      posts: postsWithInclude,
      length:count
    };
  }

  async delePostById(postId:string){
    //find post which need delete
    const post = await this.postRepository.findByPk(postId,{
      include: [Hab,]
    })
    //if post not found
    if (!post) {
      throw new HttpException('Такого поста не существует', HttpStatus.NOT_FOUND)
    }
    //habs with which the post was created
    const habsIds = post.habs.map((el: Hab) => el.id)
    //deleting an author in the hab if the count of his posts in the hab = 1
    for(const habId of habsIds){
      const data = await PostModel.findAndCountAll({
        include: [
          {
            model: Hab,
            where: {
              id: habId,
            },
          },
          {
            model: User,
            where: {
              id: post.userId,
            },
          },
        ],
      });

      if(data.count === 1){
        await this.habsService.deleteAuthorInHabAuthors(post.userId, habId)
      }
    }
    //delete post
    post.destroy()

    return {
      success:true
    }
  }

  async loadUserPosts(userId:number, type:string, page:number, pageSize:number){
    const posts = await this.postRepository.findAll({
      where:{userId, type},
      include:[{all:true}]
    })

    return posts
  }
}
