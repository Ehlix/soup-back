import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Artwork } from '../artworks/artwork.model';

type artworkLikeCreationAttributes = {
  artworkId: string;
  userId: string;
};

@Table({ tableName: 'artwork-likes' })
export class ArtworkLike extends Model<
  ArtworkLike,
  artworkLikeCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Artwork)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  artworkId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => Artwork)
  artwork: Artwork;
}
