import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('votes')
export class VoteEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @Field(() => ID)
    @Column({type: "int"})
    voter: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE'})
    @Field(() => ID)
    @Column({type: "int"})
    profile: number;

    @Field()
    @Column({ type: 'int', default: 0 })
    voteValue: number;

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamp' })
    voteDate: Date;
}