import {Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {AwsAvatarService} from "./aws.avatar.service";
import {AvatarService} from "./avatar.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {AvatarFileInterceptor} from "../common/interceptors/avatar.file.interceptor";
import {Response} from 'express';
import {AWSPresignedUrlParams} from "../common/aws-config/aws.s3.connection";
import axios from 'axios';
import {JwtAuthGuard} from "../common/auth-config/guards/jwt-auth.guard";

@Controller('avatar')
export class AvatarController {
    constructor(
        private readonly awsService: AwsAvatarService,
        private readonly avatarService: AvatarService,
    ) {}

    @Post('user/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'), AvatarFileInterceptor)
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param('id') userId: number, @Res() res: Response): Promise<void> {
        try{
            const {originalname, buffer, mimetype} = file;
            const key = `avatars/${originalname}`;
            const presignedUrl = await this.awsService.generatePresignedUrl(key, AWSPresignedUrlParams);
            await axios.put(presignedUrl, buffer, {
                headers: {
                    'Content-Type': mimetype,
                },
            });
            const savedAvatar = await this.avatarService.uploadAvatar(userId, key);
            res.status(HttpStatus.CREATED).json(savedAvatar);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getAvatar(@Param('id') id: number, @Res() res: Response): Promise<void> {
        try {
            const key = await this.avatarService.getAvatarKey(id);
            const avatarData = await this.awsService.getAvatar(key);
            res.setHeader('Content-Type', 'image/*');
            res.status(HttpStatus.OK).send(avatarData);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}