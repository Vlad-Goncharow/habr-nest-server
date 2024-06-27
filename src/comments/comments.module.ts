import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { PostModel } from 'src/posts/posts.model';
import { CommentsModel } from './comments.model';
import { AuthModule } from 'src/auth/auth.module';
import { UserFavoriteComments } from 'src/users/user-favorite-comments.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    SequelizeModule.forFeature([CommentsModel, User, UserFavoriteComments, PostModel]),
    UsersModule,
    AuthModule,
  ],
  exports: [
    CommentsService
  ]
})
export class CommentsModule {}
