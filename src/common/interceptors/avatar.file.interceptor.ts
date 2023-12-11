import {CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {ExceptionMessageEnum} from "../enums/exception.message.enum";
import {uploadFileConfig} from "../upload-config/avatar.file.config";

@Injectable()
export class AvatarFileInterceptor implements NestInterceptor{
    intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req = ctx.switchToHttp().getRequest();
        const file = req.file;

        if (!file) {
            throw new HttpException(ExceptionMessageEnum.NO_FILE_UPLOADED , HttpStatus.BAD_REQUEST)
        }

        const { allowedMimeTypes, maxFileSize } = uploadFileConfig;

        if (!allowedMimeTypes.includes(file.mimetype) || file.size > maxFileSize) {
            throw new HttpException(ExceptionMessageEnum.INVALID_FILE_TYPE_OR_SIZE, HttpStatus.BAD_REQUEST)
        }

        return next.handle();
    }
}