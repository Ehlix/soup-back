import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    // const refreshToken = req.get('cookie').replace('refreshToken=', '');
    const refreshToken = req.cookies['refreshToken'];
    return { ...payload, refreshToken };
  }

  private static extractJWT(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['refreshToken'];
    }
    return token;
  }
}
