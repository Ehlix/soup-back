import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Token } from '../tokens/tokens.model';
import { UserProfile } from '../user-profile/user-profile.model';
import { Artwork } from '../artworks/artwork.model';
import { UserFollow } from '../user-follows/user-follow.model';

type UserCreationAttributes = {
  email: string;
  password: string;
};

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
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
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  refreshTokens: Token[];

  @HasOne(() => UserProfile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userProfile: UserProfile;

  @HasMany(() => Artwork, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  artworks: Artwork[];

  @HasMany(() => UserFollow, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'userId',
  })
  userFollows: UserFollow[];

  @HasMany(() => UserFollow, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'followId',
  })
  userFollowers: UserFollow[];
}
