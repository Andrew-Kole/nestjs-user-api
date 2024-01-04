import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('avatars')
export class AvatarEntity {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    key: string;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @OneToOne(() => UserEntity, (user) => user.avatar)
    @Field(() => ID)
    @Column({type: "int"})
    user: number;
}