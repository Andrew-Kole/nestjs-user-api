import {Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {AvatarService} from "./avatar.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {AvatarFileInterceptor} from "../common/interceptors/avatar.file.interceptor";
import {Response} from 'express';
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {HttpService} from "@nestjs/axios";

// noinspection JSDeprecatedSymbols
@Controller('avatar')
export class AvatarController {
    constructor(
        private readonly avatarService: AvatarService,
        private readonly httpService: HttpService,
    ) {}

    @Post('user/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'), AvatarFileInterceptor)
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param('id') userId: number, @Res() res: Response): Promise<void> {
        try{
            const {avatar, uploadUrl} = await this.avatarService.uploadAvatar(userId, file);
            this.httpService.put(uploadUrl, file.buffer, {
                headers: {
                    'Content-Type': file.mimetype
                },
            })
            res.status(HttpStatus.CREATED).json(avatar);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    @Get(':id')
    async getAvatar(@Param('id') id: number, @Res() res: Response): Promise<void> {
        try {
            const avatarData = await this.avatarService.getAvatarKey(id);
            res.setHeader('Content-Type', 'image/*');
            res.status(HttpStatus.OK).send(avatarData);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}