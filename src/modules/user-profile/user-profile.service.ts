import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile-dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from './user-profile.model';
import { FilesService } from 'src/modules/files/files.service';
import { UsersService } from '../users/users.service';
import { errMessages } from 'src/common/constants/errMessages';
import { GetUserProfileDto } from './dto/get-user-profile-dto';
import { Op } from 'sequelize';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile) private userProfileRepository: typeof UserProfile,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  async getUserProfileByEmail(email: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        throw new BadRequestException(errMessages.USER_NOT_FOUND);
      }
      return this.userProfileRepository.findOne({
        where: { userId: user.id },
      });
    } catch (e) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
  }

  async getUserProfileByUserIdOrSite(data: { userId?: string; site?: string }) {
    if (!data.userId && !data.site) {
      throw new BadRequestException(
        errMessages.MISSING_PARAMETERS + ' userId or site',
      );
    }
    try {
      if (data.userId) {
        const userProfile = await this.userProfileRepository.findOne({
          where: { userId: data.userId },
        });
        if (!userProfile) {
          throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
        }
        return userProfile;
      }
      if (data.site) {
        const userProfile = await this.userProfileRepository.findOne({
          where: { site: data.site },
        });
        if (!userProfile) {
          throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
        }
        return userProfile;
      }
    } catch (e) {
      throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
    }
  }

  async getUserProfileByNameOrSite(dto: GetUserProfileDto) {
    try {
      const userProfile = await this.userProfileRepository.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.startsWith]: dto.username } },
            { site: { [Op.startsWith]: dto.username } },
          ],
        },
      });
      if (!userProfile) {
        throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
      }
      return userProfile;
    } catch (e) {
      throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
    }
  }

  async createUserProfile(req: Request, dto: CreateUserProfileDto) {
    const user = await this.usersService.getUserByEmail(req.user['email']);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    const candidate = await this.userProfileRepository.findOne({
      where: { userId: user.id },
    });
    if (candidate) {
      throw new BadRequestException(errMessages.PROFILE_ALREADY_EXISTS);
    }
    const avatar = await this.filesService.fromCacheToStatic(
      dto.avatar,
      user.id,
    );
    const userProfile = await this.userProfileRepository.create({
      ...dto,
      avatar,
      userId: user.id,
      site: user.id,
    });
    return userProfile;
  }

  async updateUserProfile(req: Request, dto: Partial<CreateUserProfileDto>) {
    const userId = req.user['id'];
    const user = await this.usersService.getUserById(userId);
    const userProfile = await this.getUserProfileByUserIdOrSite({ userId });
    if (dto.avatar) {
      await this.filesService.deleteFile(userProfile.avatar, user.id);
      const avatar = await this.filesService.fromCacheToStatic(
        dto.avatar,
        user.id,
      );
      try {
        await this.userProfileRepository.update(
          { ...dto, avatar },
          { where: { userId: user.id } },
        );
      } catch (e) {
        throw new BadRequestException(errMessages.UPDATE_PROFILE_FAILED);
      }
    } else {
      try {
        await this.userProfileRepository.update(
          { ...dto },
          { where: { userId: user.id } },
        );
      } catch (e) {
        throw new BadRequestException(errMessages.UPDATE_PROFILE_FAILED);
      }
    }
    return this.getUserProfileByUserIdOrSite({ userId: user.id });
  }
}
