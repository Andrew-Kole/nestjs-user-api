import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Repository} from "typeorm";
import {VoteEntity} from "../../vote/vote.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class VotePermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectRepository(VoteEntity)
        private readonly voteRepository: Repository<VoteEntity>,
        ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context)
        const args = gqlContext.getArgs();
        const ctx = gqlContext.getContext().req;
        const userId = ctx.user.id;
        const targetUserId = +args.id;
        const voteValue = args.voteDto?.voteValue;

        const votePermission =this.reflector.get<new (voteRepository: Repository<VoteEntity>) => any>('votePermission', context.getHandler());
        if (votePermission) {
            const permissionInstance = new votePermission(this.voteRepository);
            return permissionInstance.checkPermissions(userId, targetUserId, voteValue);
        }
        return false;
    }
}