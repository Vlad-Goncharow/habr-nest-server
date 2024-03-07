import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { HabPosts } from "./hab-posts.model";
import { PostModel } from "src/posts/posts.model";
import { HabAuthors } from "./hab-authors.model";
import { HabSubscribers } from "./hab-subscribers.model";


interface HabCreationAttrs {
  title: string
  image: string
  description: string
}

@Table({ tableName: 'habs' })
export class Hab extends Model<Hab, HabCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'example', description: 'Название хаба' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ApiProperty({ example: 'example.jpg', description: 'Картинка хаба' })
  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @ApiProperty({ example: 'example', description: 'Описание хаба' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ApiProperty({ example: 'avatar.jpg', description: 'Рейтинг хаба' })
  @Column({ type: DataType.STRING, defaultValue: 0 })
  rating: string;

  @ApiProperty({ description: "Посты с данным хабом", type: () => [PostModel] })
  @BelongsToMany(() => PostModel, () => HabPosts)
  posts: PostModel[]

  @ApiProperty({ description: "Авторы кто создал пост с данным хабом", type: () => [User] })
  @BelongsToMany(() => User, () => HabAuthors)
  authors: User[];

  @ApiProperty({ description: "Подписчики данного хаба", type: () => [User] })
  @BelongsToMany(() => User, () => HabSubscribers)
  usersSubscribers: User[];
}
