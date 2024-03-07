import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "./roles.model";
import { User } from "src/users/users.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: 'user_roles', createdAt:false, updatedAt:false })
export class UserRoles extends Model<UserRoles>{
  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;
  
  @ApiProperty({ example: '1', description: 'Уникальный ид роли' })
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER})
  roleId: number;
  
  @ApiProperty({ example: '1', description: 'Уникальный ид пользователя' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER})
  userId: number;
}