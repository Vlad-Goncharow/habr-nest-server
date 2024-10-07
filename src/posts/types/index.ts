import { CreatePostDto } from "../dto/create-post.dto";
import { PostModel } from "../posts.model";

export interface PostsUtilService {
  createPost(dto:CreatePostDto,userId:number): Promise<any>
  loadPostById(postId:number): Promise<any>
  seachPosts(title:string, page:number,pageSize:number): any
  loadWeeklyPosts(category:string): any
  loadPosts(category:string,type:string, page:number, pageSize:number): any;
  delePostById(postId:number, userId:number):any
  loadUserPosts(userId:number,type:string, page:number,pageSize:number):any
  loadHabPosts(habId:number,type:string, page:number,pageSize:number):any
  loadUserFavoritesPosts(userId:number,type:string, page:number,pageSize:number):any
}