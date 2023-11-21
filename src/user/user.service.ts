import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import {PasswordUtils} from "../common/utils/password.utils";
import {CreateUserDto, UpdateUserDto} from "./user.dto";

@Injectable()
export class UserService {
    constructor(
       @InjectRepository(UserEntity)
       private readonly userRepository: Repository<UserEntity>,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<UserEntity>{
        try{
            const hashedPassword = await PasswordUtils.hashPassword(createUserDto.password);
            const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
            return await this.userRepository.save(newUser);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('This user already exists.');
            }
            else {
                throw error;
            }
        }
    }

    async getUserById(id: number): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({where: { id }});
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity | undefined> {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            Object.assign(user, updateUserDto);
            if (updateUserDto.password) {
                user.password = await PasswordUtils.hashPassword(updateUserDto.password);
            }
            return await this.userRepository.save(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('User with this nickname already exists.');
            }
            else {
                throw error;
            }
        }
    }
}