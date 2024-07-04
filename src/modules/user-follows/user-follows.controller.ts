import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserFollowsService } from './user-follows.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { GetUserFollowsDto } from './dto/get-user-follows-dto';

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

  @Post('user-follows')
  getFollowsByUserId(@Body() dto: GetUserFollowsDto) {
    return this.userFollowsService.getFollowsOrFollowersByUserId(
      'follows',
      dto,
    );
  }

  @Post('user-followers')
  getFollowersByUserId(@Body() dto: GetUserFollowsDto) {
    return this.userFollowsService.getFollowsOrFollowersByUserId(
      'followers',
      dto,
    );
  }
}
