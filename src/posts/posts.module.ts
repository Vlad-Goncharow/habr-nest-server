import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModel } from 'src/comments/comments.model';
import { CommentsModule } from 'src/comments/comments.module';
import { CommentsService } from 'src/comments/comments.service';
import { HabPosts } from 'src/habs/hab-posts.model';
import { Hab } from 'src/habs/habs.model';
import { HabsModule } from 'src/habs/habs.module';
import { HabsService } from 'src/habs/habs.service';
import { UserFavoritePosts } from 'src/users/user-favorite-posts.model';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PostsController } from './posts.controller';
import { PostModel } from './posts.model';
import { PostsMockService } from './postsMockService';
import { PostsRealService } from './postsRealService';

@Module({
  controllers: [PostsController],
  providers: [
    {
      provide: 'POSTS_UTIL_SERVICE',
      useFactory: (
        configService: ConfigService,
        usersService: UsersService,
        habsService: HabsService,
        commentsService: CommentsService,
      ) => {
        const authMock: number = parseInt(configService.get<string>('AUTH_MOCK', '0'));
        return authMock 
          ? new PostsMockService() 
          : new PostsRealService(PostModel,usersService, habsService, commentsService);
      },
      inject: [ConfigService, UsersService, HabsService, CommentsService],
    },
  ],
  imports: [
    SequelizeModule.forFeature([User, PostModel, Hab, HabPosts, CommentsModel, UserFavoritePosts]),
    UsersModule,
    CommentsModule,
    HabsModule,
    AuthModule,
    ConfigModule,
  ],
  exports: ['POSTS_UTIL_SERVICE'],
})
export class PostsModule {}

