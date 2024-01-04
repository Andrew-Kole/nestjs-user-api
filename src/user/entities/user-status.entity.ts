import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserRoleEnum} from "../../common/enums/user.role.enum";
import {UserEntity} from "./user.entity";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('user_status')
export class UserStatusEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BASIC})
    role: UserRoleEnum;

    @Field()
    @Column({default: false})
    isDeleted: boolean;

    @Field()
    @Column({default: true})
    isActive: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    refreshToken: string

    @Field(() => UserEntity)
    @OneToOne(() => UserEntity, (user) => user.status, )
    user: UserEntity;
}