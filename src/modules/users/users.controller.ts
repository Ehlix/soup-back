import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  updateUser(@Body() dto: UpdateUserDto, @Req() req: any) {
    const user = req.user;
    return this.usersService.updateUser(user.email, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  deleteUser(@Req() req: Request) {
    return this.usersService.deleteUser(req.user['email']);
  }
}
