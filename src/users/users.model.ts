import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { PostModel } from "src/posts/posts.model";
import { Hab } from "src/habs/habs.model";
import { HabSubscribers } from "src/habs/hab-subscribers.model";
import { UserSubscriptions } from "./user-subscriptions-model";


interface UserCreationAttrs {
  email: string
  password: string
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'example@gmail.com', description: 'Почта пользователя' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  
  @ApiProperty({ example: 'example', description: 'Пароль пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  
  @ApiProperty({ example: 'nicnname', description: 'Ник пользователя' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  nickname: string;
  
  @ApiProperty({ example: 'avatar.jpg', description: 'Автар пользователя' })
  @Column({ type: DataType.STRING, defaultValue: null })
  avatar: string;
  
  @ApiProperty({ example: '0', description: 'Карма пользователя' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  karma: number;
  
  @ApiProperty({ example: '0', description: 'Рейтинг пользователя' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  rating: number;
  
  @ApiProperty({ example: 'full name example', description: 'Полное имя пользователя' })
  @Column({ type: DataType.STRING, defaultValue: 'Не известно' })
  fullName: string;
  
  @ApiProperty({ example: 'about example', description: 'Обо мне пользователя' })
  @Column({ type: DataType.STRING, defaultValue: 'Пользователь' })
  description: string;
  
  @ApiProperty({ example: 'male', description: 'Пол пользователя' })
  @Column({ type: DataType.STRING, defaultValue: 'Не известно' })
  gender: string;
  
  @ApiProperty({ example: '20.06.4242', description: 'Дата рождения пользователя' })
  @Column({ type: DataType.STRING, defaultValue: 'Не известно' })
  dateOfBirth: string;
  
  @ApiProperty({ example: 'country example', description: 'Страна проживания пользователя' })
  @Column({ type: DataType.STRING, defaultValue: 'Не известно' })
  country: string;

  @ApiProperty({ description: 'Роли пользователя', type:() => [Role] })
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[]
  
  @ApiProperty({ description: "Посты пользователя", type: () => [PostModel] })
  @HasMany(() => PostModel)
  posts: PostModel[];

  @ApiProperty({ description: "Подписки на хабы пользователя", type: () => [HabSubscribers] })
  @BelongsToMany(() => Hab, () => HabSubscribers)
  habSubscribers: Hab[];

  @ApiProperty({ description: "Подписки пользователя", type: () => [User] })
  @BelongsToMany(() => User, () => UserSubscriptions, 'subscriberId', 'subscriptionId')
  subscriptions: User[];

  @ApiProperty({ description: "Подписчики пользователя", type: () => [User] })
  @BelongsToMany(() => User, () => UserSubscriptions, 'subscriptionId', 'subscriberId')
  subscribers: User[];

}