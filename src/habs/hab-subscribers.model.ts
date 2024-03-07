import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Hab } from "./habs.model";
import { User } from "src/users/users.model";

@Table({ tableName: 'hab_subscribers', createdAt: true, updatedAt: true })
export class HabSubscribers extends Model<HabSubscribers> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Hab)
  @Column({ type: DataType.INTEGER })
  habId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  // Дополнительные поля, например, дата подписки, статус и т. д.

  @BelongsTo(() => Hab)
  hab: Hab;

  @BelongsTo(() => User)
  user: User;
}
