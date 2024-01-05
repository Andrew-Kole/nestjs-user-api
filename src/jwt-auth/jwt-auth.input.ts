import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";
import {ValidationFailed} from "../common/enums/validator.message.enum";

@InputType()
export class LoginInput {
    @Field()
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    nickname: string;

    @Field()
    @IsNotEmpty({message: ValidationFailed.IS_EMPTY})
    password: string;
}