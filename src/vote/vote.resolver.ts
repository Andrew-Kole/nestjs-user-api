import {Args, Context, Int, Mutation, Resolver} from "@nestjs/graphql";
import {VoteEntity} from "./vote.entity";
import {VoteService} from "./vote.service";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {VoteInput} from "./vote.input";
import {VotePermissionGuard} from "../common/guards/vote.permission.guard";
import {UseVotePermissions} from "../common/decorators/permissions.decorator";
import {VoteCreatePermissions} from "../common/permissions/vote/vote.create.permissions";
import {VoteUpdatePermission} from "../common/permissions/vote/vote.update.permission";
import {VoteDeletePermission} from "../common/permissions/vote/vote.delete.permission";

@Resolver(() => VoteEntity)
@UseGuards(JwtAuthGuard, VotePermissionGuard)
export class VoteResolver{
    constructor(
        private readonly voteService: VoteService,
    ) {}

    @Mutation(() => VoteEntity)
    @UseVotePermissions(VoteCreatePermissions)
    async vote(
        @Args('id', {type: () => Int}) profileId: number,
        @Args('voteDto') voteDto: VoteInput,
        @Context('req') req: any,
    ): Promise<VoteEntity> {
        const voterId = req.user.id;
        return await this.voteService.createVote(profileId, voterId, voteDto);
    }

    @Mutation(() => VoteEntity)
    @UseVotePermissions(VoteUpdatePermission)
    async updateVote(
        @Args('id', {type: () => Int}) id: number,
        @Args('voteDto') voteDto: VoteInput,
    ): Promise<VoteEntity> {
        return await this.voteService.updateVote(id, voteDto);
    }

    @Mutation(() => Boolean)
    @UseVotePermissions(VoteDeletePermission)
    async deleteVote(@Args('id', {type: () => Int}) voteId: number): Promise<boolean> {
        await this.voteService.deleteVote(voteId);
        return true;
    }
}