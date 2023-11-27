import {UserRoleEnum} from "../../enums/user.role.enum";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserUpdatePermissions {
    checkPermissions(userId: number, userRole: UserRoleEnum, targetUserId: number, targetUserRole: UserRoleEnum, reqBody: Record<string, any> ): boolean {
        if(userId === targetUserId) {
            return this.selfUpdatePermissions(reqBody);
        }
        switch (userRole) {
            case UserRoleEnum.BASIC:
                return false;
            case UserRoleEnum.MODER:
                return this.moderUpdatePermissions(targetUserRole, reqBody);
            case UserRoleEnum.ADMIN:
                return this.adminUpdatePermissions(targetUserRole, reqBody);
        }
    }

    private selfUpdatePermissions(reqBody: Record<string, any>): boolean {
        return Object.keys(reqBody).some(key => ['nickname', 'firstName', 'lastName', 'password'].includes(key));
    }
    private moderUpdatePermissions(targetUserRole: UserRoleEnum, reqBody: Record<string, any>): boolean {
        return targetUserRole === UserRoleEnum.BASIC && Object.keys(reqBody).some(key => ['nickname', 'firstName', 'lastName', 'isActive'].includes(key));
    }

    private adminUpdatePermissions(targetUserRole: UserRoleEnum, reqBody: Record<string, any>): boolean {
        return (targetUserRole === UserRoleEnum.BASIC || targetUserRole === UserRoleEnum.MODER) && Object.keys(reqBody).some(key => ['nickname', 'firstName', 'lastName', 'isActive', 'role'].includes(key));
    }
}