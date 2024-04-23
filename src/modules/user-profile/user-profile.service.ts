import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile-dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from './user-profile.model';
import { FilesService } from 'src/files/files.service';
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

  async getUserProfileByUserId(userId: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    return this.userProfileRepository.findOne({
      where: { userId: user.id },
    });
  }

  async createUserProfile(req: Request, dto: CreateUserProfileDto, image) {
    const user = await this.usersService.getUserByEmail(req.user['email']);
    const avatar = await this.filesService.createImageFile(image, user.id);
    const userProfile = await this.userProfileRepository.create({
      ...dto,
      avatar,
      userId: user.id,
      site: user.id,
    });
    return userProfile;
  }

  async updateUserProfile(
    req: Request,
    dto: Partial<CreateUserProfileDto>,
    image,
  ) {
    const user = await this.usersService.getUserByEmail(req.user['email']);
    const userProfile = await this.userProfileRepository.findOne({
      where: { userId: user.id },
    });
    if (!userProfile) {
      throw new BadRequestException(errMessages.PROFILE_NOT_FOUND);
    }
    if (image) {
      await this.filesService.deleteFile(userProfile.avatar, user.id);
      const avatar = await this.filesService.createImageFile(image, user.id);
      return await this.userProfileRepository.update(
        { ...dto, avatar },
        { where: { userId: user.id } },
      );
    } else {
      return await this.userProfileRepository.update(
        { ...dto },
        { where: { userId: user.id } },
      );
    }
  }
}
