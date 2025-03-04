import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {UserService} from "./user.service";
import {UserStatusEntity} from "./entities/user-status.entity";
import {UserResolver} from "./user.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserStatusEntity])],
    providers: [UserService, UserResolver],
    exports: [UserService]
})
export class UserModule{}

