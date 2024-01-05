import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {VoteEntity} from "../../../vote/vote.entity";
import {Repository} from "typeorm";
import {ExceptionMessageEnum} from "../../enums/exception.message.enum";

@Injectable()
export class VoteUpdatePermission {
    constructor(
        @InjectRepository(VoteEntity)
        private readonly voteRepository: Repository<VoteEntity>,
    ){}

    async checkPermissions(userId: number, voteId: number, voteValue: number): Promise<boolean> {
        const vote = await this.voteRepository.findOne({where: { id: voteId } });
        if(!vote){
            throw new NotFoundException(ExceptionMessageEnum.VOTE_NOT_FOUND);
        }
        if(userId !== vote.voter) {
            throw new ForbiddenException(ExceptionMessageEnum.VOTE_NOT_OWNER);
        }
        if(voteValue === vote.voteValue) {
            throw new ForbiddenException(ExceptionMessageEnum.NO_CHANGES);
        }
        return true;
    }
}