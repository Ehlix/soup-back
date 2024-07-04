import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

type UserFollowCreationAttributes = {
  userId: string;
  followId: string;
};

@Table({ tableName: 'user-follows' })
export class UserFollow extends Model<
  UserFollow,
  UserFollowCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  followId: string;

  @BelongsTo(() => User, 'followId')
  follower: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User, 'userId')
  follow: User;
}
