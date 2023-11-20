import {HttpStatus, Injectable, NestMiddleware} from "@nestjs/common";
import {UserService} from "./user.service";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class UniqueNicknameMiddleware implements NestMiddleware{
    constructor(private readonly userService: UserService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const nickname = req.body.nickname;
            const isNicknameExists = await this.userService.checkIfNicknameExists(nickname);
            if(isNicknameExists) {
                res.status(HttpStatus.CONFLICT).json({message: 'Nickname already exists, choose another nickname.'})
            }
            next();
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}