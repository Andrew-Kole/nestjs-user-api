import {Field, InputType} from "@nestjs/graphql";
import {UserRoleEnum} from "../../common/enums/user.role.enum";
import {IsBoolean, IsEnum, IsOptional, IsString, Matches, MinLength} from "class-validator";
import {ValidationFailed} from "../../common/enums/validator.message.enum";
import {passwordRegex} from "../../common/regex-patterns/password.regex";

@InputType()
export class UpdateUserInput{
    @Field({nullable: true})
    @IsOptional()
    @IsString({message: ValidationFailed.IS_STRING})
    nickname: string;

    @Field({nullable: true})
    @IsOptional()
    @IsString({message: ValidationFailed.IS_STRING})
    firstName: string;

    @Field({nullable: true})
    @IsOptional()
    @IsString({message: ValidationFailed.IS_STRING})
    lastName: string;

    @Field({nullable: true})
    @IsOptional()
    @MinLength(8, {message: ValidationFailed.MINIMAL_LENGTH})
    @Matches(passwordRegex, {message: ValidationFailed.MUST_CONTAIN})
    password: string;

    @Field({nullable: true})
    @IsOptional()
    @IsBoolean({ message: ValidationFailed.IS_BOOLEAN })
    isActive: boolean;

    @Field({nullable: true})
    @IsOptional()
    @IsEnum(UserRoleEnum, { message: ValidationFailed.IS_USER_ROLE_ENUM })
    role: UserRoleEnum;
}