import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { errMessages } from '../../common/constants/errMessages';
import { LoginUserDto } from './dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';
import { AuthResponse } from './response/authResponse';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokensService,
  ) {}

  async registerUsers(dto: LoginUserDto, res: Response): Promise<AuthResponse> {
    const candidate = await this.usersService.getUserByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(errMessages.USER_ALREADY_EXISTS);
    }
    await this.usersService.createUser(dto);
    const publicUser = await this.usersService.getPublicUser(dto.email);
    const { accessToken, refreshToken } =
      await this.tokenService.addRefreshToken({ userId: publicUser.id });
    this.setCookie(res, refreshToken);
    return { ...publicUser.toJSON(), accessToken };
  }

  async loginUsers(dto: LoginUserDto, res: Response): Promise<AuthResponse> {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException(errMessages.WRONG_PASSWORD_OR_EMAIL);
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {
      throw new BadRequestException(errMessages.WRONG_PASSWORD_OR_EMAIL);
    }
    const { accessToken, refreshToken } =
      await this.tokenService.addRefreshToken({
        userId: user.id,
      });
    const publicUser = await this.usersService.getPublicUser(user.email);
    this.setCookie(res, refreshToken);
    return {
      ...publicUser.toJSON(),
      accessToken,
    };
  }

  async logoutUser(req: Request, res: Response) {
    const email = req.user['email'];
    const refreshToken = req.cookies['refreshToken'];
    const user = await this.usersService.getUserByEmail(email);
    const result = await this.tokenService.removeRefreshToken({
      userId: user.id,
      refreshToken: refreshToken,
    });
    if (!result) {
      return false;
    }
    this.setCookie(res, '');
    return true;
  }

  async updateRefreshToken(req: Request, res: Response): Promise<AuthResponse> {
    const email = req.user['email'];
    const prevRefreshToken = req.cookies['refreshToken'];
    const user = await this.usersService.getUserByEmail(email);
    const { accessToken, refreshToken } =
      await this.tokenService.updateRefreshToken({
        userId: user.id,
        refreshToken: prevRefreshToken,
      });
    this.setCookie(res, refreshToken);
    const publicUser = await this.usersService.getPublicUser(user.email);
    return {
      ...publicUser.toJSON(),
      accessToken,
    };
  }

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
}
