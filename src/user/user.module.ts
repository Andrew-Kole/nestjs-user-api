import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserStatusEntity} from "./entities/user-status.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserStatusEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule{}

