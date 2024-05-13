import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './configurations';
import { User } from './modules/users/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { Token } from './modules/tokens/tokens.model';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { UserProfile } from './modules/user-profile/user-profile.model';
import { FilesModule } from './modules/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist';
import { ArtworksModule } from './modules/artworks/artworks.module';
import { join } from 'path';
import { Artwork } from './modules/artworks/artwork.model';
import { UserFollowsModule } from './modules/user-follows/user-follows.module';
import { UserFollow } from './modules/user-follows/user-follow.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        dialect: 'postgres',
        host: ConfigService.get('postgresHost'),
        port: ConfigService.get('postgresPort'),
        username: ConfigService.get('postgresUser'),
        password: ConfigService.get('postgresPassword'),
        database: ConfigService.get('postgresDatabase'),
        synchronize: true,
        autoLoadModels: true,
        models: [User, Token, UserProfile, Artwork, UserFollow],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    UsersModule,
    AuthModule,
    TokensModule,
    UserProfileModule,
    FilesModule,
    ArtworksModule,
    UserFollowsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
