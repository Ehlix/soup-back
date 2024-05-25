import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { ArtworkLike } from '../artwork-likes/artwork-like.model';

type ArtworksCreationAttributes = {
  title: string;
  description: string;
  thumbnail: string;
  files: string[];
  folders: string[];
  medium: string[];
  subjects: string[];
  userId: string;
};

@Table({ tableName: 'artworks' })
export class Artwork extends Model<Artwork, ArtworksCreationAttributes> {
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  thumbnail: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  files: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: null,
  })
  folders: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: null,
  })
  medium: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: null,
  })
  subjects: string[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @HasMany(() => ArtworkLike, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likes: ArtworkLike[];

  @BelongsTo(() => User)
  user: User;
}
