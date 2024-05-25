import { Module } from '@nestjs/common';
import { ArtworkLikesController } from './artwork-likes.controller';
import { ArtworkLikesService } from './artwork-likes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Artwork } from '../artworks/artwork.model';
import { ArtworkLike } from './artwork-like.model';
import { ArtworksModule } from '../artworks/artworks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Artwork, ArtworkLike]),
    ArtworksModule,
    UsersModule,
  ],
  controllers: [ArtworkLikesController],
  providers: [ArtworkLikesService],
})
export class ArtworkLikesModule {}
