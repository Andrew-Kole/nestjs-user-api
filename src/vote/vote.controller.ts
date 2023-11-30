import {Body, Controller, Delete, HttpStatus, Param, Post, Put, Req, Res, UseGuards} from "@nestjs/common";
import {Request, Response} from 'express';
import {VoteService} from "./vote.service";
import {JwtAuthGuard} from "../common/auth-config/guards/jwt-auth.guard";
import {VoteDto} from "./vote.dto";
import {UseVotePermissions} from "../common/auth-config/decorators/permissions.decorator";
import {VoteCreatePermissions} from "../common/auth-config/permissions/vote/vote.create.permissions";
import {VotePermissionGuard} from "../common/auth-config/guards/vote.permission.guard";
import {VoteUpdatePermission} from "../common/auth-config/permissions/vote/vote.update.permission";
import {VoteChanged} from "../common/auth-config/permissions/vote/vote.delete.permission";

@Controller('vote')
export class VoteController {
    constructor(private readonly voteService: VoteService) {}

    @Post('user/:id')
    @UseGuards(JwtAuthGuard, VotePermissionGuard)
    @UseVotePermissions(VoteCreatePermissions)
    async vote(@Param('id') profileId: number, @Body() voteDto: VoteDto, @Req() req: Request, @Res() res: Response): Promise<void>{
        const voterId = req.user['id'];
        try {
            const vote = await this.voteService.createVote(profileId, voterId, voteDto);
            res.status(HttpStatus.CREATED).json(vote);
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message: error.message});
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, VotePermissionGuard)
    @UseVotePermissions(VoteUpdatePermission)
    async updateVote(@Param('id') id: number, @Body() voteDto: VoteDto, @Res() res: Response): Promise<void> {
        try{
            const vote = await this.voteService.updateVote(id, voteDto);
            res.status(HttpStatus.OK).json(vote);
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, VotePermissionGuard)
    @UseVotePermissions(VoteChanged)
    async deleteVote(@Param('id') id: number, @Res() res: Response): Promise<void> {
        try {
            await this.voteService.deleteVote(id);
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}

