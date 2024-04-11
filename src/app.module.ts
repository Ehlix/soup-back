import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './configurations';
import { User } from './modules/users/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { Token } from './modules/tokens/tokens.model';

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
        models: [User, Token],
      }),
    }),
    UsersModule,
    AuthModule,
    TokensModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
