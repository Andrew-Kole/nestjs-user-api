import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {AvatarEntity} from "./avatar.entity";
import {Repository} from "typeorm";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";

@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(AvatarEntity)
        private readonly avatarRepository: Repository<AvatarEntity>,
    ) {}

    async uploadAvatar(userId: number, key: string): Promise<AvatarEntity> {
        const avatar = new AvatarEntity();
        avatar.user = userId;
        avatar.key = key;
        return this.avatarRepository.save(avatar);
    }

    async getAvatarKey(id: number): Promise<string> {
        const avatar = await this.avatarRepository.findOne({ where: { id: id } });
        if (!avatar) {
            throw new NotFoundException(ExceptionMessageEnum.NO_AVATAR);
        }
        return avatar.key;
    }
}