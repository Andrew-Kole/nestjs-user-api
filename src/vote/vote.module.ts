import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {VoteEntity} from "./vote.entity";
import {VoteController} from "./vote.controller";
import {VoteService} from "./vote.service";
import {UserEntity} from "../user/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([VoteEntity, UserEntity])],
    controllers: [VoteController],
    providers: [VoteService]
})
export class VoteModule {}
