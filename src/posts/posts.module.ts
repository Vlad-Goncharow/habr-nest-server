import { Module} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User } from 'src/users/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';
import { PostModel } from './posts.model';
import { HabsModule } from 'src/habs/habs.module';
import { Hab } from 'src/habs/habs.model';
import { HabPosts } from 'src/habs/hab-posts.model';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    SequelizeModule.forFeature([User, PostModel, Hab, HabPosts]),
    HabsModule,
    AuthModule,
    FilesModule
  ],
  exports:[
    PostsService
  ]
})
export class PostsModule {}
