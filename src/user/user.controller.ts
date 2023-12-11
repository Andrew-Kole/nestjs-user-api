import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards} from "@nestjs/common";
import {Response} from 'express';
import {UserService} from "./user.service";
import {UpdateUserDto} from "./dto/update.user.dto";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {UserPermissionGuard} from "../common/guards/user.permission.guard";
import {UsePermissions} from "../common/decorators/permissions.decorator";
import {UserUpdatePermissions} from "../common/permissions/user/user.update.permissions";
import {UserDeletePermissions} from "../common/permissions/user/user.delete.permissions";
import {CreateUserDto} from "./dto/create.user.dto";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
        try {
            const registeredUser = await this.userService.register(createUserDto);
            const {password, status, ...responseUser} = registeredUser;
            res.status(HttpStatus.CREATED).json({...responseUser,
                createdAt: responseUser.createdAt.toISOString(),
                role: status.role,
                isActive: status.isActive,
            });
        }
        catch (error) {
            if(error.status){
                res.status(error.status).json({message: error.message});
            }
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('id') id: string, @Res() res: Response): Promise<void>{
        const user = await this.userService.getUserById(Number(id));
        const { password, status, ...userWithoutSensitiveInfo} = user;
        res.status(HttpStatus.OK).json({...userWithoutSensitiveInfo,
            createdAt: userWithoutSensitiveInfo.createdAt.toISOString(),
            role: status.role,
            isActive: status.isActive,
        });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, UserPermissionGuard)
    @UsePermissions(UserUpdatePermissions)
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response): Promise<void> {
        try {
            const updatedUser = await this.userService.updateUser(Number(id), updateUserDto);
            const {password, status, ...userWithoutSensitiveInfo} = updatedUser;
            res.status(HttpStatus.OK).json({...userWithoutSensitiveInfo,
                createdAt: userWithoutSensitiveInfo.createdAt.toISOString(),
                role: status.role,
                isActive: status.isActive,
            });
        }
        catch (error) {
            if(error.status) {
                res.status(error.status).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
            }

        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, UserPermissionGuard)
    @UsePermissions(UserDeletePermissions)
    async deleteUser(@Param('id') id: string, @Res() res: Response): Promise<void> {
        try{
            await this.userService.deleteUser(Number(id));
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            if(error.status) {
                res.status(error.status).json({ message: error.message });
            }
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }
}