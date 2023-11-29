import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards} from "@nestjs/common";
import {Response} from 'express';
import {UserService} from "./user.service";
import {CreateUserDto, UpdateUserDto} from "./user.dto";
import {JwtAuthGuard} from "../common/auth-config/guards/jwt-auth.guard";
import {PermissionGuard} from "../common/auth-config/guards/permission.guard";
import {UsePermissions} from "../common/auth-config/decorators/permissions.decorator";
import {UserUpdatePermissions} from "../common/auth-config/permissions/user.update.permissions";
import {UserDeletePermissions} from "../common/auth-config/permissions/user.delete.permissions";


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
    @UseGuards(JwtAuthGuard, PermissionGuard)
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
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @UsePermissions(UserDeletePermissions)
    async deleteUser(@Param('id') id: string, @Res() res: Response): Promise<void> {
        try{
            await this.userService.deleteUser(Number(id));
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }
}