import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AvatarEntity} from "./avatar.entity";
import {AvatarService} from "./avatar.service";
import {AwsAvatarService} from "./aws.avatar.service";
import {HttpModule} from "@nestjs/axios";
import {createS3Provider} from "../common/aws-config/aws.s3.connection";
import {AvatarResolver} from "./avatar.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([AvatarEntity]), HttpModule],
    providers: [AvatarService, AwsAvatarService, createS3Provider, AvatarResolver],
})
export class AvatarModule {}
