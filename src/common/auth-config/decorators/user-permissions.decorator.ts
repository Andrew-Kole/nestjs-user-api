import {SetMetadata} from "@nestjs/common";

export const UsePermissions = (permissionClass: new () => any ) => SetMetadata('userPermission', permissionClass);