import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Hab } from "./habs.model";
import { User } from "src/users/users.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: 'hab_authors' })
export class HabAuthors extends Model<HabAuthors> {

  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Hab)
  @Column
  habId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Hab)
  hab: Hab;

  @BelongsTo(() => User)
  user: User;

  static associate() {
    HabAuthors.belongsTo(User, { onDelete: 'CASCADE' });
    HabAuthors.belongsTo(Hab, { onDelete: 'CASCADE' });
  }
}