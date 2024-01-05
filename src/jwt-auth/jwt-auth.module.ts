import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {UserStatusEntity} from "../user/entities/user-status.entity";
import {JwtAuthService} from "./jwt-auth.service";
import {JwtModule} from "@nestjs/jwt";
import {JwtAuthStrategy} from "./jwt-auth.strategy";
import {PassportModule} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {JwtAuthResolver} from "./jwt-auth.resolver";

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
    providers: [JwtAuthService, JwtAuthStrategy, JwtAuthResolver],
})
export class JwtAuthModule {}