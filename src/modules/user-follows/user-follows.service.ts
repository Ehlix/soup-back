import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { errMessages } from 'src/common/constants/errMessages';
import { UserFollow } from './user-follow.model';
import { UserProfileService } from '../user-profile/user-profile.service';
import { User } from '../users/user.model';
import { UserProfile } from '../user-profile/user-profile.model';
import { UserFollowsResponse } from './response/userFollowsResponse';

@Injectable()
export class UserFollowsService {
  constructor(
    @InjectModel(UserFollow) private userFollowRepository: typeof UserFollow,
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService,
  ) {}

  async followUser(followId: string, req: Request) {
    const userId = req.user['id'];
    if (userId === followId) {
      throw new BadRequestException(errMessages.SELF_FOLLOW);
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    const followUser = await this.usersService.getUserById(followId);
    if (!followUser) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    const candidate = await this.userFollowRepository.findOne({
      where: { userId, followId },
    });
    if (candidate) {
      throw new BadRequestException(errMessages.FOLLOW_ALREADY_EXISTS);
    }
    const userFollow = await this.userFollowRepository.create({
      userId,
      followId,
    });
    return userFollow;
  }

  async unFollowUser(followId: string, req: Request) {
    const userId = req.user['id'];
    if (userId === followId) {
      throw new BadRequestException(errMessages.SELF_FOLLOW);
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    try {
      await this.userFollowRepository.destroy({
        where: { userId, followId },
      });
    } catch (error) {
      throw new BadRequestException(errMessages.FOLLOW_NOT_FOUND);
    }
    return true;
  }

  async getFollowsOrFollowersByUserId(
    mode: 'follows' | 'followers',
    userId?: string,
    site?: string,
  ): Promise<UserFollowsResponse[]> {
    if (!userId && !site) {
      throw new BadRequestException(
        errMessages.MISSING_PARAMETERS + ' userId or site',
      );
    }
    const userProfile =
      await this.userProfileService.getUserProfileByUserIdOrSite(userId, site);
    if (!userProfile) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    if (mode === 'follows') {
      return await this.userFollowRepository.findAll({
        where: { userId: userProfile.userId },
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
    } else {
      return await this.userFollowRepository.findAll({
        where: { followId: userProfile.userId },
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
    }
  }
}
