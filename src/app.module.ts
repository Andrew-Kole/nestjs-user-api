import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { VoteModule } from './vote/vote.module';
import { AvatarModule } from './avatar/avatar.module';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal:true,
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: configService.get('DB_PORT'),
              username: configService.get('DB_USER'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
              entities: ['dist/**/*.entity.js'],
              synchronize: true,
          }),
          inject: [ConfigService],
      }),
      UserModule,
      JwtAuthModule,
      VoteModule,
      AvatarModule,
  ],
})
export class AppModule {}
