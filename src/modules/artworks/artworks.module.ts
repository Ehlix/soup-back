import { Module } from '@nestjs/common';
import { ArtworksController } from './artworks.controller';
import { ArtworksService } from './artworks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Artwork } from './artwork.model';
import { User } from '../users/user.model';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Artwork]),
    FilesModule,
    UsersModule,
    UserProfileModule,
  ],
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}
