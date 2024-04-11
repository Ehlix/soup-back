import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Token } from './tokens.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Token])],
  providers: [TokensService, JwtService],
  exports: [TokensService],
})
export class TokensModule {}
