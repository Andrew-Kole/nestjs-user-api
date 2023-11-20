import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UniqueNicknameMiddleware} from "./unigue-nickname.middleware";
import {UserRoutesEnum} from "../../enums/user/routes.enum";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UniqueNicknameMiddleware).forRoutes(UserRoutesEnum.UserRegister);
    }
}
