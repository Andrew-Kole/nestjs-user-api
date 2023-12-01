import {IsNotEmpty, IsString, Matches, MinLength} from "class-validator";
import {ValidationFailed} from "../../common/enums/validator.message.enum";
import {passwordRegex} from "../../common/regex-patterns/password.regex";

export class CreateUserDto {
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @IsString({message: ValidationFailed.IS_STRING})
    nickname: string;

    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @IsString({message: ValidationFailed.IS_STRING})
    firstName: string;

    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @IsString({message: ValidationFailed.IS_STRING})
    lastName: string;

    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @MinLength(8,{message: ValidationFailed.MINIMAL_LENGTH})
    @Matches(passwordRegex, {message: ValidationFailed.MUST_CONTAIN})
    password: string;
}