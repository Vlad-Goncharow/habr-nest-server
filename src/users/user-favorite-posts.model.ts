import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PostModel } from "src/posts/posts.model";
import { User } from "./users.model";

@Table({ tableName: 'user_favorite_posts', createdAt: false, updatedAt: false })
export class UserFavoritePosts extends Model<UserFavoritePosts> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER})
  userId: number;

  @ForeignKey(() => PostModel)
  @Column({ type: DataType.INTEGER})
  postId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => PostModel)
  post: PostModel;
}