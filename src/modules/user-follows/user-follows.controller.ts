import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserFollowsService } from './user-follows.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';

@Controller('user-follows')
export class UserFollowsController {
  constructor(private readonly userFollowsService: UserFollowsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('follow')
  followUser(@Req() req: Request, @Query('followId') followId?: string) {
    return this.userFollowsService.followUser(followId, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('unfollow')
  unFollowUser(@Req() req: Request, @Query('followId') followId?: string) {
    return this.userFollowsService.unFollowUser(followId, req);
  }

  @Get('user-follows')
  getFollowsByUserId(
    @Query('userId') userId?: string,
    @Query('site') site?: string,
  ) {
    return this.userFollowsService.getFollowsOrFollowersByUserId(
      'follows',
      userId,
      site,
    );
  }

  @Get('user-followers')
  getFollowersByUserId(
    @Query('userId') userId?: string,
    @Query('site') site?: string,
  ) {
    return this.userFollowsService.getFollowsOrFollowersByUserId(
      'followers',
      userId,
      site,
    );
  }
}
