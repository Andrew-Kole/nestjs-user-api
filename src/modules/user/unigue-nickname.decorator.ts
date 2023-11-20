import {ConflictException, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {UserService} from "./user.service";

export const UniqueNicknameDecorator = (userService: UserService) => createParamDecorator(
    async (_, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const nickname = req.body.nickname;
        if (await userService.checkIfNicknameExists(nickname)) {
            throw new ConflictException("Nickname already exists");
        }

        return true;
    },
);