import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsString, Matches, MinLength} from "class-validator";
import {ValidationFailed} from "../../common/enums/validator.message.enum";
import {passwordRegex} from "../../common/regex-patterns/password.regex";

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @IsString({message: ValidationFailed.IS_STRING})
    nickname: string;

    @Field()
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @IsString({message: ValidationFailed.IS_STRING})
    firstName: string;

    @Field()
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @IsString({message: ValidationFailed.IS_STRING})
    lastName: string;

    @Field()
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    @MinLength(8,{message: ValidationFailed.MINIMAL_LENGTH})
    @Matches(passwordRegex, {message: ValidationFailed.MUST_CONTAIN})
    password: string;
}