import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/users.model';

@Table
export class RefreshToken extends Model<RefreshToken> {
  @Column({ type: DataType.STRING(1234), allowNull: false, unique: true })
  token: string;

  @ForeignKey(() => User)
  @Column
  userId: number;
  

  @BelongsTo(() => User)
  user: User;
}