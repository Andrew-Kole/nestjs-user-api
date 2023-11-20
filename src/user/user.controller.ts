import {Body, Controller, Get, HttpStatus, Param, Post, Res} from "@nestjs/common";
import {Response} from 'express'
import {UserService} from "./user.service";
import {IUserModel} from "./user.model";
import {UserEntity} from "./user.entity";
import {CreateUserDto, ResponseUserDto} from "./user.dto";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const registeredUser = await this.userService.register(createUserDto);
        const {password, ...responseUser} = registeredUser;
        return responseUser;
    }

    @Get(':id')
    async getUserById(@Param('id') id: string, @Res() res: Response): Promise<ResponseUserDto | undefined>{
        const user = await this.userService.getUserById(Number(id));
        if(!user){
            res.status(HttpStatus.NOT_FOUND).json({message: 'User not found'});
            return;
        }

        const { password, ...userWithoutSensitiveInfo} = user;
        return userWithoutSensitiveInfo;
    }
}