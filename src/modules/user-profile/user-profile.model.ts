import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

type UserProfileCreationAttributes = {
  name: string;
  city: string;
  country: string;
  headline: string;
  userId: string;
  site: string;
  avatar?: string;
  folders?: string[];
  description?: string;
};

@Table({ tableName: 'users-profiles' })
export class UserProfile extends Model<
  UserProfile,
  UserProfileCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  site: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  headline: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  avatar: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: null,
  })
  folders: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: null,
  })
  social: JSON;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
