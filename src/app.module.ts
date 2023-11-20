import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as ormconfig from "ormconfig.js"

@Module({
  imports: [
      TypeOrmModule.forRoot(ormconfig),
      UserModule,
  ],
})
export class AppModule {}
