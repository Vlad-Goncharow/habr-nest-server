import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PostModel } from "src/posts/posts.model";
import { User } from "src/users/users.model";


@Table({ tableName: 'comments' })
export class CommentsModel extends Model<CommentsModel> {
  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'example', description: 'Текст коментария' })
  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @ApiProperty({ example: '1', description: 'Ключ юзера' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => User)
  userId: number

  @ApiProperty({ example: '1', description: 'Ключ поста' })
  @ForeignKey(() => PostModel)
  postId: number

  @ApiProperty({ description: "Автор поста", type: () => [User] })
  @BelongsTo(() => User)
  author: User

  @ApiProperty({ description: "Пост в котором оставлен коментарий", type: () => [PostModel] })
  @BelongsTo(() => PostModel)
  post: PostModel
}
