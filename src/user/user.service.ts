import {ConflictException, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import {PasswordUtils} from "../common/utils/password.utils";
import {CreateUserDto} from "./user.dto";

@Injectable()
export class UserService {
    constructor(
       @InjectRepository(UserEntity)
       private readonly userRepository: Repository<UserEntity>,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<UserEntity>{
        const nicknameExists = await this.checkIfNicknameExists(createUserDto.nickname);
        if (nicknameExists){
            throw new ConflictException('User already exists, use other nickname!')
        }

        const hashedPassword = await PasswordUtils.hashPassword(createUserDto.password);
        const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    async findByNickname(nickname: string): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({ where: { nickname } });
    }

    async checkIfNicknameExists(nickname: string): Promise<boolean> {
        const existingUser = await this.findByNickname(nickname);
        return !!existingUser;
    }

    async getUserById(id: number): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({where: { id }});
    }
}