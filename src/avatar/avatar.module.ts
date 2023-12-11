import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AvatarEntity} from "./avatar.entity";
import {AvatarController} from "./avatar.controller";
import {AvatarService} from "./avatar.service";
import {AwsAvatarService} from "./aws.avatar.service";
import {HttpModule} from "@nestjs/axios";
import {createS3Provider} from "../common/aws-config/aws.s3.connection";

@Module({
    imports: [TypeOrmModule.forFeature([AvatarEntity]), HttpModule],
    controllers: [AvatarController],
    providers: [AvatarService, AwsAvatarService, createS3Provider],
})
export class AvatarModule {}
