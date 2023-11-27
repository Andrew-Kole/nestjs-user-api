import {Injectable} from "@nestjs/common";
import {UserRoleEnum} from "../../enums/user.role.enum";

@Injectable()
export class UserDeletePermissions{
    checkPermissions(userId: number, userRole: UserRoleEnum, targetUserId: number, targetUserRole: UserRoleEnum): boolean {
        if (userId === targetUserId) {
            return true;
        }
        else if (userRole === UserRoleEnum.ADMIN && (targetUserRole === UserRoleEnum.BASIC || UserRoleEnum.MODER)) {
            return true;
        }
        else {
            return false;
        }
    }
}