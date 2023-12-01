import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Repository} from "typeorm";
import {VoteEntity} from "../../vote/vote.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class VotePermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectRepository(VoteEntity)
        private readonly voteRepository: Repository<VoteEntity>,
        ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const userId = req.user.id;
        const targetUserId = +req.params.id;
        const voteValue = req.body.voteValue;

        const votePermission =this.reflector.get<new (voteRepository: Repository<VoteEntity>) => any>('votePermission', ctx.getHandler());
        if (votePermission) {
            const permissionInstance = new votePermission(this.voteRepository);
            return permissionInstance.checkPermissions(userId, targetUserId, voteValue);
        }
        return false;
    }
}