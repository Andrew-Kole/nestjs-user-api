import {ForbiddenException, Injectable} from "@nestjs/common";
import {VoteEntity} from "../../../vote/vote.entity";
import {Repository} from "typeorm";
import {ExceptionMessageEnum} from "../../enums/exception.message.enum";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class VoteCreatePermissions {
    constructor(
        @InjectRepository(VoteEntity)
        private readonly voteRepository: Repository<VoteEntity>
    ) {}

    async checkPermissions(userId: number, targetUserId: number, voteValue: number): Promise<boolean> {
        return await this.selfVoteCheck(userId, targetUserId) && await this.doubleVoteCheck(userId, targetUserId) && await this.recentlyVotedCheck(userId);
    }

    private async selfVoteCheck(userId: number, targetUserId: number): Promise<boolean> {
        if (userId === targetUserId) {
            throw new ForbiddenException(ExceptionMessageEnum.SELF_VOTE);
        }
        return true;
    }

    private async doubleVoteCheck (userId: number, targetUserId: number): Promise<boolean> {
        console.log(userId)
        console.log(targetUserId)
        const existingVote = await this.voteRepository.findOne({ where: { voter:userId, profile: targetUserId } });
        console.log(existingVote);
        if(existingVote) {
            throw new ForbiddenException(ExceptionMessageEnum.DOUBLE_VOTE);
        }
        return true;
    }

    private async recentlyVotedCheck(userId: number): Promise<boolean> {
        const lastVote = await this.voteRepository.findOne({ where: { voter: userId }, order: { voteDate: 'DESC' } });
        if (lastVote) {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            if(lastVote.voteDate > oneHourAgo) {
                throw new ForbiddenException(ExceptionMessageEnum.VOTED_RECENTLY);
            }
        }
        return true;
    }
}