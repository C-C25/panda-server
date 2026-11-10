import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys-values';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(ENV_DB_HOST_KEY),
        port: Number(configService.get(ENV_DB_PORT_KEY)),
        username: configService.get<string>(ENV_DB_USERNAME_KEY),
        password: configService.get<string>(ENV_DB_PASSWORD_KEY),
        database: configService.get<string>(ENV_DB_DATABASE_KEY),
        autoLoadEntities: true,
        synchronize: true, // 자동 싱크 임시 허용
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
