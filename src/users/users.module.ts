import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { PostModel } from 'src/posts/posts.model';
import { Hab } from 'src/habs/habs.model';
import { HabPosts } from 'src/habs/hab-posts.model';
import { HabAuthors } from 'src/habs/hab-authors.model';
import { HabSubscribers } from 'src/habs/hab-subscribers.model';
import { UserSubscriptions } from './user-subscriptions-model';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[
    SequelizeModule.forFeature([User, Role, UserRoles, PostModel, Hab, HabPosts, HabAuthors, HabSubscribers, UserSubscriptions]),
    RolesModule,
    PostsModule,
    forwardRef(() => AuthModule),
  ],
  exports:[
    UsersService
  ]
})
export class UsersModule {}
