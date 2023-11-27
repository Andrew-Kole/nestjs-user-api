import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {UserStatusEntity} from "../user/entities/user-status.entity";
import {JwtAuthController} from "./jwt-auth.controller";
import {JwtAuthService} from "./jwt-auth.service";
import {JwtModule} from "@nestjs/jwt";
import {JWT_SECRET_KEY} from "../common/constants/jwt.constant";
import {JwtAuthStrategy} from "./jwt-auth.strategy";
import {PassportModule} from "@nestjs/passport";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserStatusEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' }
        }),
    ],
    controllers: [JwtAuthController],
    providers: [JwtAuthService, JwtAuthStrategy],
})
export class JwtAuthModule {}