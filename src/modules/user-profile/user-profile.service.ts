import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile-dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from './user-profile.model';
import { FilesService } from 'src/modules/files/files.service';
import { UsersService } from '../users/users.service';
import { errMessages } from 'src/common/constants/errMessages';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile) private userProfileRepository: typeof UserProfile,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  async getUserProfileByEmail(email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    return this.userProfileRepository.findOne({
      where: { userId: user.id },
    });
  }

  async getUserProfileByUserIdOrSite(userId?: string, site?: string) {
    if (!userId && !site) {
      throw new BadRequestException(
        errMessages.MISSING_PARAMETERS + ' userId or site',
      );
    }
    try {
      if (userId) {
        const userProfile = await this.userProfileRepository.findOne({
          where: { userId: userId },
        });
        if (!userProfile) {
          throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
        }
        return userProfile;
      }
      if (site) {
        const userProfile = await this.userProfileRepository.findOne({
          where: { site: site },
        });
        if (!userProfile) {
          throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
        }
        return userProfile;
      }
    } catch (error) {
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
    const user = await this.usersService.getUserByEmail(req.user['email']);
    const userProfile = await this.userProfileRepository.findOne({
      where: { userId: user.id },
    });
    if (!userProfile) {
      throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
    }
    if (dto.avatar) {
      await this.filesService.deleteFile(userProfile.avatar, user.id);
      const avatar = await this.filesService.fromCacheToStatic(
        dto.avatar,
        user.id,
      );
      await this.userProfileRepository.update(
        { ...dto, avatar },
        { where: { userId: user.id } },
      );
    } else {
      await this.userProfileRepository.update(
        { ...dto },
        { where: { userId: user.id } },
      );
    }
    return this.getUserProfileByUserIdOrSite(user.id);
  }
}
