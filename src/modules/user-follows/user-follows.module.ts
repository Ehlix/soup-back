import { Module } from '@nestjs/common';
import { UserFollowsService } from './user-follows.service';
import { UserFollowsController } from './user-follows.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { UsersModule } from '../users/users.module';
import { UserFollow } from './user-follow.model';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserFollow]),
    UsersModule,
    UserProfileModule,
  ],
  controllers: [UserFollowsController],
  providers: [UserFollowsService],
})
export class UserFollowsModule {}
