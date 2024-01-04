import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Repository} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {UserStatusEntity} from "../user/entities/user-status.entity";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";
import {PasswordUtils} from "../common/utils/password.utils";
import {InjectRepository} from "@nestjs/typeorm";
import {LoginInput} from "./jwt-auth.input";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService,
                @InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>,
                @InjectRepository(UserStatusEntity)
                private readonly userStatusRepository: Repository<UserStatusEntity>) {}

    async login(loginDto: LoginInput): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.validateUser(loginDto);
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await PasswordUtils.hashPassword(accessToken);
        user.status.refreshToken = refreshToken;
        await this.userRepository.save(user.status);

        return { accessToken, refreshToken };
    }

    private async validateUser(loginDto: LoginInput): Promise<UserEntity>{
        const user = await this.getByNickname(loginDto.nickname);
        if (!user || user.status.isDeleted) {
            throw new UnauthorizedException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
        if (!user.status.isActive) {
            throw new UnauthorizedException(ExceptionMessageEnum.USER_IS_BANNED);
        }
        const providedPassword = await PasswordUtils.hashPassword(loginDto.password);
        if(providedPassword !== user.password) {
            throw new UnauthorizedException(ExceptionMessageEnum.INVALID_CREDENTIALS);
        }
        return user;
    }

    private async getByNickname(nickname: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: {nickname}, relations: ['status'] });
        if (!user) {
            return undefined;
        }
        return user;
    }

    private async generateAccessToken(user: UserEntity): Promise<string> {
        const payload = { id: user.id, role: user.status.role };
        return this.jwtService.sign(payload);
    }
}