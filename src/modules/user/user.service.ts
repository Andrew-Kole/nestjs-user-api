import {ConflictException, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserModel } from "./user.model";
import { UserEntity } from "./user.entity";
import {PasswordUtils} from "../../utils/password.utils";

@Injectable()
export class UserService {
    constructor(
       @InjectRepository(UserEntity)
       private readonly userRepository: Repository<UserEntity>,
    ) {}

    async register(user: IUserModel): Promise<UserEntity>{
        const nicknameExists = await this.checkIfNicknameExists(user.nickname);
        if (nicknameExists){
            throw new ConflictException('User already exists, use other nickname!')
        }

        const hashedPassword = await PasswordUtils.hashPassword(user.password);
        const newUser = this.userRepository.create({ ...user, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    async findByNickname(nickname: string): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({ where: { nickname } });
    }

    async checkIfNicknameExists(nickname: string): Promise<boolean> {
        const existingUser = await this.findByNickname(nickname);
        return !!existingUser;
    }

}