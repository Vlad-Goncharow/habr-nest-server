import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { PostModel } from 'src/posts/posts.model';
import { CommentsModel } from './comments.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    SequelizeModule.forFeature([CommentsModel, User, PostModel]),
    AuthModule,
  ],
  exports: [
    CommentsService
  ]
})
export class CommentsModule {}
