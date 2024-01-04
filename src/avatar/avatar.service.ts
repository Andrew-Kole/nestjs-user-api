import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {AvatarEntity} from "./avatar.entity";
import {Repository} from "typeorm";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";
import {AwsAvatarService} from "./aws.avatar.service";
import {S3} from "aws-sdk";

@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(AvatarEntity)
        private readonly avatarRepository: Repository<AvatarEntity>,
        private readonly awsAvatarService: AwsAvatarService,
    ) {}

    async uploadAvatar(userId: number, file) {
        const key = `avatars/${file.filename}`;
        const presignedUrl = await this.awsAvatarService.generatePresignedUrl(key);
        const avatar = new AvatarEntity();
        avatar.user = userId;
        avatar.key = key;
        await this.awsAvatarService.uploadFileToS3({
            Key: presignedUrl,
            Body: file.createReadStream(),
            ContentType: file.mimetype,
        });
        return this.avatarRepository.save(avatar);
    }

    async getAvatarKey(id: number): Promise<S3.Body> {
        const avatar = await this.avatarRepository.findOne({ where: { id: id } });
        if (!avatar) {
            throw new NotFoundException(ExceptionMessageEnum.NO_AVATAR);
        }
        return this.awsAvatarService.getAvatar(avatar.key);
    }
}