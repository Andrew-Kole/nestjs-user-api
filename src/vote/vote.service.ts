import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {VoteEntity} from "./vote.entity";
import {Repository} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";
import {RATING_DELETE_VOTE_MULTIPLIER, RATING_UPDATE_VOTE_MULTIPLIER} from "../common/constants/vote.constant";
import {VoteInput} from "./vote.input";

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(VoteEntity)
        private readonly voteRepository: Repository<VoteEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}
    async createVote(profileId: number, voterId: number, voteDto: VoteInput): Promise<VoteEntity> {
        await this.updateUserRating(profileId, voteDto.voteValue);
        const vote = this.voteRepository.create({
            profile: profileId,
            voter: voterId,
            voteValue: voteDto.voteValue,
            voteDate: new Date(),
        });
        return this.voteRepository.save(vote);
    }

    async updateVote(id: number, voteDto: VoteInput): Promise<VoteEntity> {
        const vote = await this.getVoteById(id);
        await this.updateUserRating(vote.profile, voteDto.voteValue * RATING_UPDATE_VOTE_MULTIPLIER);

        vote.voteValue = voteDto.voteValue;
        return this.voteRepository.save(vote);
    }

    async deleteVote(id: number): Promise<void> {
        const vote = await this.getVoteById(id);
        await this.updateUserRating(vote.profile, vote.voteValue * RATING_DELETE_VOTE_MULTIPLIER);
        await this.voteRepository.remove(vote);
    }

    private async updateUserRating(profileId: number, voteValue: number) {
        const user = await this.userRepository.findOne({where: { id: profileId } });
        if (!user) {
            throw new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND);
        }
        user.rating = user.rating + voteValue;
        await this.userRepository.save(user);
    }

    private async getVoteById(id: number): Promise<VoteEntity> {
        const vote = await this.voteRepository.findOne( { where: { id: id } });
        if (!vote) {
            throw new NotFoundException(ExceptionMessageEnum.VOTE_NOT_FOUND);
        }
        return vote;
    }
}