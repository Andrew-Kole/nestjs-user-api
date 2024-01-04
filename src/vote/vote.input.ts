import {Field, InputType, Int} from "@nestjs/graphql";
import {IsIn, IsInt, IsNotEmpty} from "class-validator";
import {ValidationFailed} from "../common/enums/validator.message.enum";

@InputType()
export class VoteInput {
    @Field(() => Int)
    @IsNotEmpty({ message: ValidationFailed.IS_EMPTY })
    @IsInt({ message: ValidationFailed.IS_INT })
    @IsIn([1, -1], { message: ValidationFailed.IS_NOT_VOTE_VALUE })
    voteValue: number;
}