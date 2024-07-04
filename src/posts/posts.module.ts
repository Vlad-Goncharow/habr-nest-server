import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModel } from 'src/comments/comments.model';
import { HabPosts } from 'src/habs/hab-posts.model';
import { Hab } from 'src/habs/habs.model';
import { HabsModule } from 'src/habs/habs.module';
import { User } from 'src/users/users.model';
import { PostsController } from './posts.controller';
import { PostModel } from './posts.model';
import { PostsService } from './posts.service';
import { UserFavoritePosts } from 'src/users/user-favorite-posts.model';
import { UsersModule } from 'src/users/users.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    SequelizeModule.forFeature([User, PostModel, Hab, HabPosts, CommentsModel, UserFavoritePosts]),
    UsersModule,
    CommentsModule,
    HabsModule,
    AuthModule,
  ],
  exports:[
    PostsService
  ]
})
export class PostsModule {}
