import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {UserStatusEntity} from "../user/entities/user-status.entity";
import {JwtAuthController} from "./jwt-auth.controller";
import {JwtAuthService} from "./jwt-auth.service";
import {JwtModule} from "@nestjs/jwt";
import {JwtAuthStrategy} from "./jwt-auth.strategy";
import {PassportModule} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserStatusEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: '1h'
                }
            }),
        }),
    ],
    controllers: [JwtAuthController],
    providers: [JwtAuthService, JwtAuthStrategy],
})
export class JwtAuthModule {}