import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from './tokens.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { errMessages } from '../../common/constants/errMessages';
import { UpdateTokensDto } from './dto/update-tokens-dto';
import { CreateTokensDto } from './dto/create-tokens-dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token) private readonly tokenRepository: typeof Token,
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async addRefreshToken(dto: CreateTokensDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    const { accessToken, refreshToken } = await this.generateJwtTokens(
      user.email,
    );
    await this.tokenRepository.create({
      userId: user.id,
      refreshToken: refreshToken,
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(dto: UpdateTokensDto) {
    const verifyToken = await this.verifyToken(dto.refreshToken, 'refresh');
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    const candidate = await this.tokenRepository.findOne({
      where: { userId: dto.userId, refreshToken: dto.refreshToken },
    });
    if (!candidate) {
      throw new BadRequestException(errMessages.REFRESH_TOKEN_NOT_FOUND);
    }
    if (!verifyToken.valid) {
      await this.tokenRepository.destroy({
        where: { userId: dto.userId, refreshToken: dto.refreshToken },
      });
      throw new BadRequestException(verifyToken.message);
    }
    const { accessToken, refreshToken } = await this.generateJwtTokens(
      user.email,
    );
    await this.tokenRepository.update(
      { refreshToken: refreshToken },
      { where: { userId: dto.userId, refreshToken: dto.refreshToken } },
    );
    return { accessToken, refreshToken };
  }

  async removeRefreshToken(dto: UpdateTokensDto) {
    const candidate = await this.tokenRepository.findOne({
      where: { userId: dto.userId, refreshToken: dto.refreshToken },
    });
    if (!candidate) {
      return false;
    }
    await this.tokenRepository.destroy({
      where: { userId: dto.userId, refreshToken: dto.refreshToken },
    });
    return true;
  }

  private async generateJwtTokens(user: any) {
    const payload = { email: user };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwtAccessSecret'),
        expiresIn: this.configService.get('jwtAccessExpiration'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: this.configService.get('jwtRefreshExpiration'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async verifyToken(token: string, type: 'access' | 'refresh') {
    const res = {
      valid: true,
      message: 'valid token',
    };
    try {
      await this.jwtService.verifyAsync(token, {
        secret:
          type === 'access'
            ? this.configService.get('jwtAccessSecret')
            : this.configService.get('jwtRefreshSecret'),
      });
      return res;
    } catch (error) {
      res.valid = false;
      if ((error.name = 'TokenExpiredError')) {
        res.message = errMessages.EXPIRED_TOKEN;
        return res;
      }
      res.message = errMessages.INVALID_TOKEN;
      return res;
    }
  }
}
