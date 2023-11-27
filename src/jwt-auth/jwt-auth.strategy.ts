import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {JWT_SECRET_KEY} from "../common/constants/jwt.constant";
import {JwtPayload} from "../common/auth-config/jwt-payload.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {UserStatusEntity} from "../user/entities/user-status.entity";
import {UnauthorizedException} from "@nestjs/common";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";


export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor( @InjectRepository(UserEntity)
                 private readonly userRepository: Repository<UserEntity>,
                 @InjectRepository(UserStatusEntity)
                 private readonly userStatusRepository: Repository<UserStatusEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET_KEY,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.findOne({ where: {id: payload.id}, relations: ['status'] });
        if (!user || user.status.isDeleted) {
            throw new UnauthorizedException(ExceptionMessageEnum.USER_NOT_FOUND);
        }

        if (!user.status.isActive) {
            throw new UnauthorizedException(ExceptionMessageEnum.USER_IS_BANNED);
        }

        return user;
    }
}