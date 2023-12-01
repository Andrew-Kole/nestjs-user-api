import {SetMetadata} from "@nestjs/common";
import {VoteEntity} from "../../vote/vote.entity";
import {Repository} from "typeorm";

export const UsePermissions = (permissionClass: new () => any ) => SetMetadata('userPermission', permissionClass);
export const UseVotePermissions = (permissionClass: new (voteRepository: Repository<VoteEntity>) => any) => SetMetadata('votePermission', permissionClass);