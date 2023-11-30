import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AvatarEntity} from "./avatar.entity";
import {AvatarController} from "./avatar.controller";
import {AvatarService} from "./avatar.service";
import {AwsAvatarService} from "./aws.avatar.service";

@Module({
    imports: [TypeOrmModule.forFeature([AvatarEntity])],
    controllers: [AvatarController],
    providers: [AvatarService, AwsAvatarService],
})
export class AvatarModule {}
