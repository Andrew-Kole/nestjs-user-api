import {IsIn, IsInt, IsNotEmpty} from "class-validator";
import {ValidationFailed} from "../common/enums/validator.message.enum";

export class VoteDto {

    @IsNotEmpty({ message: ValidationFailed.IS_EMPTY })
    @IsInt({ message: ValidationFailed.IS_INT })
    @IsIn([1, -1], { message: ValidationFailed.IS_NOT_VOTE_VALUE })
    voteValue: number;
}