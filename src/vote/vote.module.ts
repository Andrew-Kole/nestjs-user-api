import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {VoteEntity} from "./vote.entity";
import {VoteService} from "./vote.service";
import {UserEntity} from "../user/entities/user.entity";
import {VoteResolver} from "./vote.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([VoteEntity, UserEntity])],
    providers: [VoteService, VoteResolver]
})
export class VoteModule {}
