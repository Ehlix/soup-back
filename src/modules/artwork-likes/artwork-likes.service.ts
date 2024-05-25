import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ArtworkLike } from './artwork-like.model';
import { ArtworksService } from '../artworks/artworks.service';
import { errMessages } from 'src/common/constants/errMessages';
import { UsersService } from '../users/users.service';
import { Artwork } from '../artworks/artwork.model';

@Injectable()
export class ArtworkLikesService {
  constructor(
    @InjectModel(ArtworkLike) private artworkLikeRepository: typeof ArtworkLike,
    private readonly artworksService: ArtworksService,
    private readonly usersService: UsersService,
  ) {}

  async dislikeArtwork(artworkId: string, userId: string) {
    const hasLike = await this.checkArtworkLike(artworkId, userId);
    if (!hasLike) {
      throw new BadRequestException(errMessages.LIKE_NOT_FOUND);
    }
    await this.artworkLikeRepository.destroy({
      where: { artworkId, userId },
    });
    return true;
  }

  async likeArtwork(artworkId: string, userId: string) {
    const hasLike = await this.checkArtworkLike(artworkId, userId);
    if (hasLike) {
      throw new BadRequestException(errMessages.LIKE_ALREADY_EXISTS);
    }
    const artwork = await this.artworksService.getArtworkById(artworkId);
    if (!artwork) {
      throw new BadRequestException(errMessages.ARTWORK_NOT_FOUND);
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    await this.artworkLikeRepository.create({
      userId,
      artworkId,
    });
    return true;
  }

  async checkArtworkLike(artworkId: string, userId: string) {
    try {
      const hasLike = await this.artworkLikeRepository.findOne({
        where: { artworkId, userId },
      });
      return hasLike ? true : false;
    } catch (e) {
      throw new BadRequestException(errMessages.LIKE_NOT_FOUND);
    }
  }

  async getUserArtworkLikesCount(userId: string) {
    try {
      const count = await this.artworkLikeRepository.count({
        where: { userId },
      });
      return count;
    } catch (e) {
      throw new BadRequestException(errMessages.LIKE_NOT_FOUND);
    }
  }

  async getArtworkLikesCount(artworkId: string) {
    try {
      const count = await this.artworkLikeRepository.count({
        where: { artworkId },
      });
      return count;
    } catch (e) {
      throw new BadRequestException(errMessages.LIKE_NOT_FOUND);
    }
  }

  async getUserArtworkLikes(userId: string) {
    try {
      const artworks = await this.artworkLikeRepository.findAll({
        where: { userId },
        include: [
          {
            model: Artwork,
            as: 'artwork',
          },
        ],
      });
      return artworks;
    } catch (e) {
      throw new BadRequestException(errMessages.LIKE_NOT_FOUND);
    }
  }

  async getArtworkLikes(artworkId: string) {
    try {
      const artworks = await this.artworkLikeRepository.findAll({
        where: { artworkId },
      });
      return artworks;
    } catch (e) {
      throw new BadRequestException(errMessages.LIKE_NOT_FOUND);
    }
  }
}
