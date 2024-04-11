import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { TokensModule } from '../tokens/tokens.module';
import { AccessTokenStrategy } from '../../strategy/accessToken.strategy';
import { RefreshTokenStrategy } from '../../strategy/refreshToken.strategy';

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
