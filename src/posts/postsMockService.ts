import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { mockPosts, postMock, postNewPost } from "src/utils/mocks/posts";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsUtilService } from "./types";

@Injectable()
export class PostsMockService  implements PostsUtilService {
  constructor() {}

  async createPost(dto: CreatePostDto): Promise<any> {
    return{
      ...postNewPost,
      ...dto,
    }
  }

  async loadPostById(postId: number): Promise<any> {
    const post = mockPosts.find((el) => el.id === postId)

    if(!post){
      throw new HttpException('Такого поста не существует', HttpStatus.NOT_FOUND)
    }

    return post
  }

  async seachPosts(title: string, page: number, pageSize: number){
    const filteredPosts = mockPosts.filter(post =>
      post.title.toLowerCase().includes(title.toLowerCase())
    );
    return {
      length: filteredPosts.length,
      posts: filteredPosts.slice((page - 1) * pageSize, page * pageSize),
    };
  }

  async loadWeeklyPosts(category: string) {
    return mockPosts.filter(el => el.category === category)
  }

  async loadPosts(category: string, type: string, page: number, pageSize: number) {
    const filteredPosts = mockPosts.filter(post => post.category === category && post.type === type);
    const paginatedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
    
    return {
      length: filteredPosts.length, 
      posts: paginatedPosts, 
    };
  }

  async delePostById() {
    return {
      success:true
    }
  }

  async loadUserPosts(userId: number, type: string, page: number, pageSize: number) {
    const filteredPosts = mockPosts.filter(post => post.userId === userId && post.type === type);
    const paginatedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
    
    return {
      length: filteredPosts.length, 
      posts: paginatedPosts, 
    };
  }

  async loadHabPosts(habId: number, type: string, page: number, pageSize: number) {
    const filteredPosts = mockPosts.filter(
      post => post.habs.some(hab => hab.id === habId) && post.type === type,
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      length: filteredPosts.length,
      posts: filteredPosts.slice(start, end),
    };
  }

  async loadUserFavoritesPosts(userId: number, type: string, page: number, pageSize: number) {
    const filteredPosts = mockPosts.filter(post => post.userId === userId && post.type === type);
    const paginatedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
    
    return {
      length: filteredPosts.length, 
      posts: paginatedPosts, 
    };
  }
}