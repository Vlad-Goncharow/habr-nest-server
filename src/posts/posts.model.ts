import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { CommentsModel } from "src/comments/comments.model";
import { HabPosts } from "src/habs/hab-posts.model";
import { Hab } from "src/habs/habs.model";
import { User } from "src/users/users.model";


interface PostCreationAttrs {
  title: string
  image: string
  content: string
}

@Table({ tableName: 'posts' })
export class PostModel extends Model<PostModel, PostCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'example', description: 'Название поста' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ApiProperty({ example: 'example.jpg', description: 'Картинка поста' })
  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @ApiProperty({ example: 'example', description: 'Текст поста' })
  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @ApiProperty({ example: 'example', description: 'Сложность поста' })
  @Column({ type: DataType.STRING, allowNull: false })
  difficulty: string;

  @ApiProperty({ example: 'avatar.jpg', description: 'Колличество просмотров' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  views: number;

  @ApiProperty({ example: 'develop', description: 'Категория поста' })
  @Column({ type: DataType.STRING, defaultValue: 'develop', allowNull: false })
  category: string;

  @ApiProperty({ example: 'post', description: 'Тип поста' })
  @Column({ type: DataType.STRING, defaultValue: 'develop', allowNull: false })
  type: string;

  @ApiProperty({ example: 0, description: 'Колличество коментариев' })
  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  commentsCount: number;

  @ApiProperty({ description: "Автор поста", type: () => [User] })
  @BelongsTo(() => User)
  author: User 

  @ApiProperty({ description: "Хабы поста", type: () => [Hab] })
  @BelongsToMany(() => Hab, () => HabPosts)
  habs: Hab[];

  @ApiProperty({ description: "Коментарии поста", type: () => [CommentsModel] })
  @HasMany(() => CommentsModel)
  comments: CommentsModel[];

  @ApiProperty({ example: '1', description: 'Ключ юзера' })
  @ForeignKey(() => User)
  userId: number
}
