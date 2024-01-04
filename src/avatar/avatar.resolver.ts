import {Args, Context, Mutation, Resolver} from "@nestjs/graphql";
import {AvatarService} from "./avatar.service";
import {AvatarEntity} from "./avatar.entity";
import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {uploadFileConfig} from "../common/upload-config/avatar.file.config";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";

@Resolver(() => AvatarEntity)
@UseGuards(JwtAuthGuard)
export class AvatarResolver {
    constructor(private readonly avatarService: AvatarService) {}

    @Mutation(() => AvatarEntity)
    async uploadAvatar(
        @Args('file', {type: () => GraphQLUpload}) file: GraphQLUpload,
        @Context('req') req: any
    ): Promise<AvatarEntity> {
        const userId = req.user.id;
        if (!uploadFileConfig.allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(ExceptionMessageEnum.INVALID_FILE_TYPE_OR_SIZE);
        }
        return await this.avatarService.uploadAvatar(userId, file);
    }
}