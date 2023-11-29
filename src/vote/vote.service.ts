import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {VoteEntity} from "./vote.entity";
import {Repository} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {VoteDto} from "./vote.dto";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(VoteEntity)
        private readonly voteRepository: Repository<VoteEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}
    async castVote(profileId: number, voterId: number, voteDto: VoteDto): Promise<VoteEntity> {
        await this.updateUserRating(profileId, voteDto.voteValue);
        const vote = this.voteRepository.create({
            profile: profileId,
            voter: voterId,
            voteValue: voteDto.voteValue,
            voteDate: new Date(),
        });
        return this.voteRepository.save(vote);
    }

    private async updateUserRating(profileId: number, voteValue: number) {
        const user = await this.userRepository.findOne({where: { id: profileId } });
        if (!user) {
            throw new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
        user.rating = user.rating + voteValue;
        await this.userRepository.save(user);
    }
}