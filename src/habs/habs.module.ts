import { Module } from '@nestjs/common';
import { HabsService } from './habs.service';
import { HabsController } from './habs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hab } from './habs.model';
import { HabPosts } from './hab-posts.model';
import { PostModel } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { HabAuthors } from './hab-authors.model';
import { HabSubscribers } from './hab-subscribers.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [HabsController],
  providers: [HabsService],
  imports:[
    SequelizeModule.forFeature([Hab, HabPosts, HabAuthors, HabSubscribers, PostModel, User]),
    AuthModule,
  ],
  exports:[
    HabsService,
  ]
})
export class HabsModule {}
