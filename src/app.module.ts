import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { VoteModule } from './vote/vote.module';
import { AvatarModule } from './avatar/avatar.module';
import * as ormconfig from "ormconfig.js"

@Module({
  imports: [
      TypeOrmModule.forRoot(ormconfig),
      UserModule,
      JwtAuthModule,
      VoteModule,
      AvatarModule,
  ],
})
export class AppModule {}
