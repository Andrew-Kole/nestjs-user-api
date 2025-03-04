import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {InjectRepository} from "@nestjs/typeorm";
import {UserStatusEntity} from "../../user/entities/user-status.entity";
import {Repository} from "typeorm";
import {UserRoleEnum} from "../enums/user.role.enum";
import {ExceptionMessageEnum} from "../enums/exception.message.enum";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class UserPermissionGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector,
        @InjectRepository(UserStatusEntity)
        private readonly userStatusRepository: Repository<UserStatusEntity>
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context)
        const args = gqlContext.getArgs();
        const ctx = gqlContext.getContext().req;
        const userId = ctx.user.id;
        const userRole = ctx.user.status.role;
        const targetUserId = +args.id;

        const userPermission = this.reflector.get<new () => any>('userPermission', context.getHandler());

        if (userPermission) {
            const targetUserRole = await this.getTargetUserRole(targetUserId);
            const permissionInstance = new userPermission();
            return permissionInstance.checkPermissions(userId, userRole, targetUserId, targetUserRole, args.updateUserDto);
        }
        return false;
    }

    private async getTargetUserRole(targetUserId: number): Promise<UserRoleEnum> {
        try {
            const userStatus = await this.userStatusRepository.findOne({ where: { user: { id: targetUserId } }, relations: ['user'] });
            return userStatus?.role;
        }
        catch (error) {
            throw new UnauthorizedException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
    }
}