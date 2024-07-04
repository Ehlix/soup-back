import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Artwork } from './artwork.model';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { Request } from 'express';
import { CreateArtworksDto } from './dto/create-artworks-dto';
import { errMessages } from 'src/common/constants/errMessages';
import { GetAllArtworksDto } from './dto/get-all-artworks-dto';
import { UserProfileService } from '../user-profile/user-profile.service';
import { UserProfile } from '../user-profile/user-profile.model';
import { User } from '../users/user.model';
import { updateArtworkDto } from './dto/update-artwork-dto';
import { Op } from 'sequelize';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectModel(Artwork) private artworksRepository: typeof Artwork,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
    private readonly userProfileService: UserProfileService,
  ) {}

  async uploadImages(
    req: Request,
    data: {
      thumbnail: Express.Multer.File[];
      files: Express.Multer.File[];
    },
  ) {
    const thumbnail = await this.filesService.createImageFileInCache(
      data.thumbnail[0],
    );
    const files = await Promise.all(
      data.files.map((file) => this.filesService.createImageFileInCache(file)),
    );
    return { thumbnail, files };
  }

  async uploadImage(
    req: Request,
    data: Express.Multer.File,
  ): Promise<{ file: string }> {
    const file = await this.filesService.createImageFileInCache(data);
    return { file };
  }

  async createArtwork(req: Request, dto: CreateArtworksDto) {
    const user = await this.usersService.getUserByEmail(req.user['email']);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    let thumbnail = await this.filesService.fromCacheToStatic(
      dto.thumbnail,
      user.id,
    );
    const files = await this.filesService.fromCacheToStatic(dto.files, user.id);
    if (!files || files.length === 0) {
      throw new HttpException(
        errMessages.CREATE_FILE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!thumbnail) {
      thumbnail = files.at(0);
    }
    const artwork = await this.artworksRepository.create({
      ...dto,
      thumbnail,
      files,
      userId: user.id,
    });
    return await this.getUserArtwork(user.id, artwork.id);
  }

  async updateArtwork(req: Request, dto: updateArtworkDto, artworkId: string) {
    const user = await this.usersService.getUserByEmail(req.user['email']);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    await this.artworksRepository.update(
      {
        ...dto,
      },
      { where: { userId: user.id, id: artworkId } },
    );
    return await this.getUserArtwork(user.id, artworkId);
  }

  async getAllArtworks(dto: GetAllArtworksDto) {
    const date = dto.dateStart ? new Date(dto.dateStart) : new Date();
    if (dto.userId) {
      const profile =
        await this.userProfileService.getUserProfileByUserIdOrSite({
          userId: dto.userId,
        });
      if (!profile) {
        throw new BadRequestException(errMessages.USER_NOT_FOUND);
      }
    }
    if (!dto.order || dto.order === 'newest') {
      const artworks = await this.artworksRepository.findAll({
        where: {
          createdAt: { [Op.lte]: date },
          userId: dto.userId || { [Op.ne]: null },
          medium: dto.medium
            ? { [Op.contains]: [dto.medium] }
            : { [Op.ne]: null },
          subjects: dto.subject
            ? { [Op.contains]: [dto.subject] }
            : { [Op.ne]: null },
        },
        offset: dto.offset || 0,
        limit: dto.limit,
        order: [['updatedAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id'],
            include: [
              { model: UserProfile, as: 'userProfile', required: false },
            ],
          },
        ],
      });
      return artworks;
    }
  }

  async getUserArtworks(dto: GetAllArtworksDto) {
    return this.getAllArtworks(dto);
    // const userId = dto.userId;
    // const userProfile =
    //   await this.userProfileService.getUserProfileByUserIdOrSite(userId);
    // if (!userProfile) {
    //   throw new BadRequestException(errMessages.USER_NOT_FOUND);
    // }
    // const artworks = await this.artworksRepository.findAll({
    //   where: {
    //     userId,
    //     medium: { [Op.contains]: [dto.medium] },
    //     subjects: {
    //       [Op.contains]: [dto.subject],
    //     },
    //   },
    //   order: [['updatedAt', 'DESC']],
    //   include: [
    //     {
    //       model: User,
    //       as: 'user',
    //       attributes: ['id'],
    //       include: [{ model: UserProfile, as: 'userProfile', required: false }],
    //     },
    //   ],
    // });
    // return artworks;
  }

  async getArtworkById(id: string) {
    try {
      const artworks = await this.artworksRepository.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id'],
            include: [
              { model: UserProfile, as: 'userProfile', required: false },
            ],
          },
        ],
      });
      return artworks;
    } catch (e) {
      throw new BadRequestException(errMessages.ARTWORK_NOT_FOUND);
    }
  }

  async getUserArtwork(userId: string, artworkId: string) {
    const artworks = await this.artworksRepository.findOne({
      where: { id: artworkId, userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
          include: [{ model: UserProfile, as: 'userProfile', required: false }],
        },
      ],
    });
    return artworks;
  }

  async deleteArtwork(req: Request, id: string) {
    const user = await this.usersService.getUserByEmail(req.user['email']);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    await this.artworksRepository.destroy({ where: { id, userId: user.id } });
    return true;
  }
}
