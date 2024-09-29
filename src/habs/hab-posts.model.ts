import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { ApiProperty } from "@nestjs/swagger";
import { Hab } from "./habs.model";
import { PostModel } from "src/posts/posts.model";

@Table({ tableName: 'hab_posts', createdAt: false, updatedAt: false })
export class HabPosts extends Model<HabPosts>{
  @ApiProperty({ example: '1', description: 'Уникальный ид' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: '1', description: 'Уникальный ид хаба' })
  @ForeignKey(() => Hab)
  @Column({ type: DataType.INTEGER })
  habId: number;

  @ApiProperty({ example: '1', description: 'Уникальный ид поста' })
  @ForeignKey(() => PostModel)
  @Column({ type: DataType.INTEGER })
  postId: number;


  @BelongsTo(() => PostModel)
  post: PostModel;

  @BelongsTo(() => Hab)
  hab: Hab;

  static associate() {
    HabPosts.belongsTo(PostModel, { onDelete: 'CASCADE' });
    HabPosts.belongsTo(Hab, { onDelete: 'CASCADE' });
  }
}