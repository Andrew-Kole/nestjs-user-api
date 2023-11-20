import {Body, Controller, Injectable, Post} from "@nestjs/common";
import {UserService} from "./user.service";
import {IUserModel} from "./user.model";
import {UniqueNicknameDecorator} from "./unigue-nickname.decorator";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    //@ts-ignore
    async register(@Body() user: IUserModel, @UniqueNicknameDecorator(this.userService) uniqueNickname: boolean) {
        return await this.userService.register(user);
    }
}