import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/users.model";
import { LoginDto } from "../dto/LoginDto";
import { UpdateProfileDto } from "../dto/UpdateProfileDto";

export interface AuthUtilService {
  registration(dto: CreateUserDto): Promise<{ cookies: any; result: any }>;
  resendVerification(user: User): Promise<{ success:boolean }>;
  confirmEmail(userId: number): Promise<{ success:boolean }>;
  login(dto: LoginDto): Promise<{ cookies: any; result: any }>;
  refresh(refreshToken: string): Promise<{ cookies: any; result: any }>;
  logout(userId: number): Promise<{ success:boolean }>;
  profileUpdate(userId:number, dto:UpdateProfileDto): Promise<any>;
  deleteUser(tokenId:number, userId:number): Promise<{ success:boolean }>;
}
