import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { AuthResponse } from './response/authResponse';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return this.authService.registerUsers(dto, res);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return await this.authService.loginUsers(dto, res);
  }

  @UseGuards(AccessTokenGuard)
  @Post('test')
  test() {
    return true;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(req, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.updateRefreshToken(req, res);
  }
}
