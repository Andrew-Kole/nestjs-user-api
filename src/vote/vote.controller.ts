import {Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {Request, Response} from 'express';
import {VoteService} from "./vote.service";
import {JwtAuthGuard} from "../common/auth-config/guards/jwt-auth.guard";
import {VoteDto} from "./vote.dto";

@Controller('vote')
export class VoteController {
    constructor(private readonly voteService: VoteService) {}

    @Post('user/:id')
    @UseGuards(JwtAuthGuard)
    async vote(@Param('id') profileId: number, @Body() voteDto: VoteDto, @Req() req: Request, @Res() res: Response): Promise<void>{
        const voterId = req.user['id'];
        try {
            const vote = await this.voteService.castVote(profileId, voterId, voteDto);
            res.status(HttpStatus.CREATED).json(vote);
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message: error.message});
        }

    }
}

