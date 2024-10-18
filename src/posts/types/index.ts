import { CreatePostDto } from "../dto/create-post.dto";
import { PostModel } from "../posts.model";

export interface PostsUtilService {
  createPost(dto:CreatePostDto,userId:number): Promise<PostModel>
  loadPostById(postId:number): Promise<PostModel>
  seachPosts(title:string, page:number,pageSize:number):Promise<{length:number, posts:PostModel[]}>
  loadWeeklyPosts(category:string): Promise<PostModel[]>
  loadPosts(category:string,type:string, page:number, pageSize:number):Promise<{length:number, posts:PostModel[]}>;
  delePostById(postId:number, userId:number): Promise<{success:boolean}>
  loadUserPosts(userId:number,type:string, page:number,pageSize:number):Promise<{length:number, posts:PostModel[]}>
  loadHabPosts(habId:number,type:string, page:number,pageSize:number):Promise<{length:number, posts:PostModel[]}>
  loadUserFavoritesPosts(userId:number,type:string, page:number,pageSize:number):Promise<{length:number, posts:PostModel[]}>
}