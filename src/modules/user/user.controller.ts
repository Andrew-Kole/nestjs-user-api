import {Body, Controller, Get, HttpStatus, Param, Post, Res} from "@nestjs/common";
import {Response} from 'express'
import {UserService} from "./user.service";
import {IUserModel} from "./user.model";
import {UserEntity} from "./user.entity";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() user: IUserModel) {
        const registeredUser = await this.userService.register(user);
        const {password, createdAt, ...responseUser} = registeredUser;
        return responseUser;
    }

    @Get(':id')
    async getUserById(@Param('id') id: string, @Res() res: Response): Promise<UserEntity | undefined>{
        const user = await this.userService.getUserById(Number(id));
        if(!user){
            res.status(HttpStatus.NOT_FOUND).json({message: 'User not found'});
            return;
        }

        const { id: userId, password, ...userWithoutSensitiveInfo} = user;
        res.json(userWithoutSensitiveInfo);
    }
}