import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from './user-profile.model';
import { User } from '../users/user.model';
import { FilesModule } from 'src/modules/files/files.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserProfile]),
    FilesModule,
    UsersModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
