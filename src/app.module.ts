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
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist';
import * as path from 'path';

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
        models: [User, Token, UserProfile],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    UsersModule,
    AuthModule,
    TokensModule,
    UserProfileModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
