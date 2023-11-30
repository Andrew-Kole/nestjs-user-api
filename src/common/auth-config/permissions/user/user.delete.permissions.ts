import {Injectable} from "@nestjs/common";
import {UserRoleEnum} from "../../../enums/user.role.enum";

@Injectable()
export class UserDeletePermissions{
    async checkPermissions(userId: number, userRole: UserRoleEnum, targetUserId: number, targetUserRole: UserRoleEnum, reqBody: Record<string, any>): Promise<boolean> {
        if (userId === targetUserId) {
            return true;
        }
        else return !!(userRole === UserRoleEnum.ADMIN && (targetUserRole === UserRoleEnum.BASIC || UserRoleEnum.MODER));
    }
}