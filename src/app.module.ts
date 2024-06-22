import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/users.model';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { RefreshToken } from './refresh-tokens/refresh-tokens.model';
import { PostsModule } from './posts/posts.module';
import { HabsModule } from './habs/habs.module';
import { PostModel } from './posts/posts.model';
import { Hab } from './habs/habs.model';
import { HabPosts } from './habs/hab-posts.model';
import { HabAuthors } from './habs/hab-authors.model';
import { HabSubscribers } from './habs/hab-subscribers.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path'
import { UserSubscriptions } from './users/user-subscriptions-model';
import { CommentsModule } from './comments/comments.module';
import { CommentsModel } from './comments/comments.model';
import { FilesModule } from './files/files.module';
import { UserFavoritePosts } from './users/user-favorite-posts.model';
import { UserFavoriteComments } from './users/user-favorite-comments.model';
@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({envFilePath:`.env.${process.env.NODE_ENV}`}),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../uploads")
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, UserSubscriptions, UserFavoritePosts, UserFavoriteComments, RefreshToken, PostModel, Hab, HabPosts, HabAuthors, HabSubscribers, CommentsModel],
      autoLoadModels: true,
    }),
    FilesModule,
    AuthModule,
    RefreshTokensModule,
    UsersModule,
    RolesModule,
    PostsModule,
    HabsModule,
    CommentsModule,
  ],
})
export class AppModule {}
