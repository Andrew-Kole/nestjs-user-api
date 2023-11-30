import {CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {ExceptionMessageEnum} from "../enums/exception.message.enum";

@Injectable()
export class AvatarFileInterceptor implements NestInterceptor{
    intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req = ctx.switchToHttp().getRequest();
        const file = req.file;

        if (!file) {
            throw new HttpException(ExceptionMessageEnum.NO_FILE_UPLOADED , HttpStatus.BAD_REQUEST)
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const maxFileSize = 1024 * 1024 * 5;

        if (!allowedMimeTypes.includes(file.mimetype) || file.size > maxFileSize) {
            throw new HttpException(ExceptionMessageEnum.INVALID_FILE_TYPE_OR_SIZE, HttpStatus.BAD_REQUEST)
        }

        return next.handle();
    }
}