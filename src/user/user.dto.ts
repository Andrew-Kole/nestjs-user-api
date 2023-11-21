import {IsNotEmpty, IsOptional, IsString, Matches, MinLength} from "class-validator";
import {ValidationFailed} from "../common/enums/validator.message.enum";
import {passwordRegex} from "../common/regexPatterns/regex.pattern";

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

export class ResponseUserDto {
    id: number;
    nickname: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString({message: ValidationFailed.IS_STRING})
    nickname: string;
    @IsOptional()
    @IsString({message: ValidationFailed.IS_STRING})
    firstName: string;
    @IsOptional()
    @IsString({message: ValidationFailed.IS_STRING})
    lastName: string;
    @IsOptional()
    @MinLength(8, {message: ValidationFailed.MINIMAL_LENGTH})
    @Matches(passwordRegex, {message: ValidationFailed.MUST_CONTAIN})
    password: string;
}