import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile-dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { GetUserProfileDto } from './dto/get-user-profile-dto';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  getUserProfileByUserId(
    @Query('userId') userId?: string,
    @Query('site') site?: string,
  ) {
    return this.userProfileService.getUserProfileByUserIdOrSite({
      userId,
      site,
    });
  }

  @Post('search')
  getUserProfileByNameOrSite(@Body() dto: GetUserProfileDto) {
    return this.userProfileService.getUserProfileByNameOrSite(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create')
  createUserProfile(@Req() req: Request, @Body() dto: CreateUserProfileDto) {
    return this.userProfileService.createUserProfile(req, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update')
  updateUserProfile(
    @Req() req: Request,
    @Body() dto: Partial<CreateUserProfileDto>,
  ) {
    return this.userProfileService.updateUserProfile(req, dto);
  }
}
