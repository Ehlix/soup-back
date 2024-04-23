import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile-dto';
import { GetUserProfileDto } from './dto/get-user-profile-dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  getUserProfileByEmail(@Body() dto: GetUserProfileDto) {
    return this.userProfileService.getUserProfileByEmail(dto.email);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('avatar'))
  createUserProfile(
    @Req() req: Request,
    @Body() dto: CreateUserProfileDto,
    @UploadedFile() avatar,
  ) {
    return this.userProfileService.createUserProfile(req, dto, avatar);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('avatar'))
  updateUserProfile(
    @Req() req: Request,
    @Body() dto: Partial<CreateUserProfileDto>,
    @UploadedFile() avatar,
  ) {
    return this.userProfileService.updateUserProfile(req, dto, avatar);
  }
}
