import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { userMock } from "../utils/mocks/user/mocks";
import { LoginDto } from "./dto/LoginDto";
import { UpdateProfileDto } from "./dto/UpdateProfileDto";
import { AuthUtilService } from "./types";

@Injectable()
export class AuthMockService  implements AuthUtilService {
  constructor() {}

  async registration(dto: CreateUserDto): Promise<{ cookies: any; result: any }> {
    const mockUserData = {
      ...userMock,
      ...dto,
      refreshToken: 'mock_refresh_token',
    };

    const cookies = {
      refreshToken: mockUserData.refreshToken,
      options: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    };

    return { cookies, result: { ...mockUserData } };
  }

  async login(dto:LoginDto): Promise<{ cookies: any; result: any }>{
    const mockUserData = {
      ...userMock,
      ...dto,
      refreshToken: 'mock_refresh_token',
      accessToken: 'mock_access_token',
    };

    const cookies = {
      refreshToken: mockUserData.refreshToken,
      options: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    };

    return { cookies, result: { ...mockUserData } };
  }

  async refresh() {
    const mockUserData = {
      ...userMock,
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
    };

    const cookies = {
      refreshToken: mockUserData.refreshToken,
      options: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    };

   
    return { cookies, result: { ...mockUserData } };
  }

  async logout(){
    return {
      success:true
    }
  }

  async resendVerification(): Promise<{success:boolean}>{
    return {
      success:true
    };
  }

  async confirmEmail(){
    return {
      success: true, 
    };
  }

  async deleteUser() {
    return {
      success:true
    }
  }

  async profileUpdate(userId:number, dto:UpdateProfileDto){
    return {
      ...userMock,
      ...dto,
    }
  }
}