import {IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength} from "class-validator";
import {ValidationFailed} from "../common/enums/validator.message.enum";
import {passwordRegex} from "../common/regex-patterns/regex.pattern";
import {UserRoleEnum} from "../common/enums/user.role.enum";

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

    @IsOptional()
    @IsBoolean({ message: ValidationFailed.IS_BOOLEAN })
    isActive: boolean;

    @IsOptional()
    @IsEnum(UserRoleEnum, { message: ValidationFailed.IS_USER_ROLE_ENUM })
    role: UserRoleEnum;
}