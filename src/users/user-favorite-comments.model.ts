import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { CommentsModel } from "src/comments/comments.model";
import { User } from "./users.model";

@Table({ tableName: 'user_favorite_comments', createdAt: false, updatedAt: false })
export class UserFavoriteComments extends Model<UserFavoriteComments> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => CommentsModel)
  @Column({ type: DataType.INTEGER })
  commentId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => CommentsModel)
  comment: CommentsModel;
}