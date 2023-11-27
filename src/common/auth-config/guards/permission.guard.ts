import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {InjectRepository} from "@nestjs/typeorm";
import {UserStatusEntity} from "../../../user/entities/user-status.entity";
import {Repository} from "typeorm";
import {UserRoleEnum} from "../../enums/user.role.enum";
import {ExceptionMessageEnum} from "../../enums/exception.message.enum";
import {UserUpdatePermissions} from "../permissions/user.update.permissions";

@Injectable()
export class PermissionGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector,
        @InjectRepository(UserStatusEntity)
        private readonly userStatusRepository: Repository<UserStatusEntity>
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const userId = req.user.id;
        const userRole = req.user.status.role;
        const targetUserId = +req.params.id;

        const userPermission = this.reflector.get<new () => any>('userPermission', ctx.getHandler());

        if (userPermission) {
            const targetUserRole = await this.getTargetUserRole(targetUserId);
            const permissionInstance = new userPermission();
            return permissionInstance.checkPermissions(userId, userRole, targetUserId, targetUserRole, req.body);
        }
        return false;
    }

    private async getTargetUserRole(targetUserId: number): Promise<UserRoleEnum> {
        try {
            const userStatus = await this.userStatusRepository.findOne({ where: { user: { id: targetUserId } }, relations: ['user'] });
            return userStatus?.role;
        }
        catch (error) {
            throw new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
    }
}