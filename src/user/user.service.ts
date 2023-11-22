import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {PasswordUtils} from "../common/utils/password.utils";
import {CreateUserDto, UpdateUserDto} from "./user.dto";
import {UserStatusEntity} from "./entities/user-status.entity";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";

@Injectable()
export class UserService {
    constructor(
       @InjectRepository(UserEntity)
       private readonly userRepository: Repository<UserEntity>,
       @InjectRepository(UserStatusEntity)
       private readonly userStatusRepository: Repository<UserStatusEntity>
    ) {}

    async register(createUserDto: CreateUserDto): Promise<UserEntity>{
        try{
            const hashedPassword = await PasswordUtils.hashPassword(createUserDto.password);
            const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
            newUser.status = this.userStatusRepository.create();
            return await this.userRepository.save(newUser);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException(ExceptionMessageEnum.USER_ALREADY_EXISTS);
            }
            else {
                throw error;
            }
        }
    }

    async getUserById(id: number): Promise<UserEntity | undefined> {
        const user = await this.userRepository.findOne( {where: { id }, relations: ['status'] });
        if (!user || user.status.isDeleted) {
            throw new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
        if (!user.status.isActive){
            throw new ForbiddenException(ExceptionMessageEnum.USER_IS_BANNED)
        }

        return user;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity | undefined> {
        try {
            const user = await this.getUserById(id);
            if (!user || user.status.isDeleted) {
                throw new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND);
            }
            if (!user.status.isActive) {
                throw new ForbiddenException(ExceptionMessageEnum.USER_IS_BANNED);
            }
            Object.assign(user, updateUserDto);
            if (updateUserDto.password) {
                user.password = await PasswordUtils.hashPassword(updateUserDto.password);
            }
            return await this.userRepository.save(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException(ExceptionMessageEnum.USER_ALREADY_EXISTS);
            }
            else {
                throw error;
            }
        }
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.getUserById(id);
        if(!user) {
            throw new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
        user.deletedAt = new Date();
        await this.userRepository.save(user);
    }
}