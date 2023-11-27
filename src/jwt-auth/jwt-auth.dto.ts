import {IsNotEmpty} from "class-validator";
import {ValidationFailed} from "../common/enums/validator.message.enum";

export class LoginDto {
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    nickname: string;
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    password: string;
}