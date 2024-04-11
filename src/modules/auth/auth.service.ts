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
    const user = await this.usersService.getPublicUser(dto.email);
    const tokens = await this.tokenService.addRefreshToken({ userId: user.id });
    this.setCookie(res, tokens.refreshToken);
    return { user: user.toJSON(), ...tokens };
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
    const tokens = await this.tokenService.addRefreshToken({
      userId: user.id,
    });
    const publicUser = await this.usersService.getPublicUser(user.email);
    this.setCookie(res, tokens.refreshToken);
    return {
      user: publicUser.toJSON(),
      ...tokens,
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

  async refreshTokens(req: Request, res: Response) {
    const email = req.user['email'];
    const refreshToken = req.cookies['refreshToken'];
    const user = await this.usersService.getUserByEmail(email);
    const tokens = await this.tokenService.updateRefreshToken({
      userId: user.id,
      refreshToken: refreshToken,
    });
    this.setCookie(res, tokens.refreshToken);
    const publicUser = await this.usersService.getPublicUser(user.email);
    return {
      user: publicUser.toJSON(),
      ...tokens,
    };
  }

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
}
