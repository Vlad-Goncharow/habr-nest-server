import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";

@Table({ tableName: 'user_subscriptions', createdAt: false, updatedAt: false })
export class UserSubscriptions extends Model<UserSubscriptions> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  subscriberId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  subscriptionId: number;

  @BelongsTo(() => User, 'subscriberId')
  subscribers: User;

  @BelongsTo(() => User, 'subscriptionId')
  subscriptions: User;
}