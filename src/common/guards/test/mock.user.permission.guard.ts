import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UserRoleEnum} from "../../enums/user.role.enum";


@Injectable()
export class MockUserPermissionGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            throw new UnauthorizedException();
        }
        const token = authHeader.split(' ')[1];

        const {userId, userRole} = await this.getUserInfoFromToken(token);

        const targetUserId = +req.params.id;

        const userPermission = this.reflector.get<new () => any>('userPermission', ctx.getHandler());

        if (userPermission) {
            const targetUserRole = await this.getTargetUserRole(targetUserId);
            const permissionInstance = new userPermission();
            return permissionInstance.checkPermissions(userId, userRole, targetUserId, targetUserRole, req.body);
        }
        return false;
    }

    private async getUserInfoFromToken(token: string) {
        let userId: number;
        let userRole: UserRoleEnum;
        switch (token) {
            case '1.basic':
                userId = 1
                userRole = UserRoleEnum.BASIC
                break;
            case '2.moder':
                userId = 2
                userRole = UserRoleEnum.MODER
                break
            case '3.admin':
                userId = 3
                userRole = UserRoleEnum.ADMIN
                break
            default:
                throw new UnauthorizedException()
        }
        return {userId, userRole};
    }

    private async getTargetUserRole(targetUserId: number) {
        switch (targetUserId) {
            case 1:
                return UserRoleEnum.BASIC
            case 2:
                return UserRoleEnum.MODER;
            case 3:
                return UserRoleEnum.ADMIN;
        }
    }
}