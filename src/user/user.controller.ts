import {Body, Controller, Get, HttpStatus, Param, Post, Put, Res} from "@nestjs/common";
import {Response} from 'express'
import {UserService} from "./user.service";
import {CreateUserDto, ResponseUserDto, UpdateUserDto} from "./user.dto";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
        try {
            const registeredUser = await this.userService.register(createUserDto);
            const {password, ...responseUser} = registeredUser;
            res.status(HttpStatus.CREATED).json(responseUser);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: string, @Res() res: Response): Promise<void>{
        const user = await this.userService.getUserById(Number(id));
        if(!user){
            res.status(HttpStatus.NOT_FOUND).json({message: 'User not found'});
            return;
        }
        const { password, ...userWithoutSensitiveInfo} = user;
        res.status(HttpStatus.OK).json(userWithoutSensitiveInfo);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response): Promise<void> {
        try {
            const updatedUser = await this.userService.updateUser(Number(id), updateUserDto);
            const {password, ...userWithoutSensitiveInfo} = updatedUser;
            res.status(HttpStatus.OK).json(userWithoutSensitiveInfo);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }

}