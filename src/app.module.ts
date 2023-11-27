import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import * as ormconfig from "ormconfig.js"

@Module({
  imports: [
      TypeOrmModule.forRoot(ormconfig),
      UserModule,
      JwtAuthModule,
  ],
})
export class AppModule {}
