import {UserRoleEnum} from "../../enums/user.role.enum";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserUpdatePermissions {
    async checkPermissions(userId: number, userRole: UserRoleEnum, targetUserId: number, targetUserRole: UserRoleEnum, reqBody: Record<string, any> ): Promise<boolean> {
        if(userId === targetUserId) {
            return await this.selfUpdatePermissions(reqBody);
        }
        switch (userRole) {
            case UserRoleEnum.BASIC:
                return false;
            case UserRoleEnum.MODER:
                return await this.moderUpdatePermissions(targetUserRole, reqBody);
            case UserRoleEnum.ADMIN:
                return await this.adminUpdatePermissions(targetUserRole, reqBody);
        }
    }

    private async selfUpdatePermissions(reqBody: Record<string, any>): Promise<boolean> {
        return Object.keys(reqBody).some(key => ['nickname', 'firstName', 'lastName', 'password'].includes(key));
    }
    private async moderUpdatePermissions(targetUserRole: UserRoleEnum, reqBody: Record<string, any>): Promise<boolean> {
        return targetUserRole === UserRoleEnum.BASIC && Object.keys(reqBody).some(key => ['nickname', 'firstName', 'lastName', 'isActive'].includes(key));
    }

    private async adminUpdatePermissions(targetUserRole: UserRoleEnum, reqBody: Record<string, any>): Promise<boolean> {
        return (targetUserRole === UserRoleEnum.BASIC || targetUserRole === UserRoleEnum.MODER) && Object.keys(reqBody).some(key => ['nickname', 'firstName', 'lastName', 'isActive', 'role'].includes(key));
    }
}