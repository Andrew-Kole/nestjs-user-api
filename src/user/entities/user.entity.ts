import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
    UpdateDateColumn, DeleteDateColumn, BeforeUpdate, OneToMany
} from "typeorm";
import {UserStatusEntity} from "./user-status.entity";
import {VoteEntity} from "../../vote/vote.entity";
import {AvatarEntity} from "../../avatar/avatar.entity";
import {Field, ID, ObjectType} from "@nestjs/graphql";


@ObjectType()
@Entity('users')
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true})
    nickname: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column()
    password: string;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => UserStatusEntity)
    @OneToOne(() => UserStatusEntity, (status) => status.user, {cascade: true})
    @JoinColumn()
    status: UserStatusEntity;

    @Field(() => Date)
    @UpdateDateColumn({nullable: true})
    updatedAt: Date;

    @Field(() => Date)
    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @BeforeUpdate()
    updateDeletedAt() {
        if (this.deletedAt) {
            this.status.isActive = false;
            this.status.isDeleted = true;
        }
    }

    @Field()
    @Column({ type: 'int', default: 0 })
    rating: number;

    @Field(() => VoteEntity)
    @OneToMany(() => VoteEntity, (vote) => vote.profile)
    votes: VoteEntity[]

    @Field(() => AvatarEntity, {nullable: true})
    @OneToOne(() => AvatarEntity, (avatar) => avatar.user, { cascade: true, nullable: true })
    @JoinColumn()
    avatar: AvatarEntity;
}