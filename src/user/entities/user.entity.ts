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


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nickname: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => UserStatusEntity, (status) => status.user, {cascade: true})
    @JoinColumn()
    status: UserStatusEntity;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @BeforeUpdate()
    updateDeletedAt() {
        if (this.deletedAt) {
            this.status.isActive = false;
            this.status.isDeleted = true;
        }
    }

    @Column({ type: 'int', default: 0 })
    rating: number;

    @OneToMany(() => VoteEntity, (vote) => vote.profile)
    votes: VoteEntity[]

    @OneToOne(() => AvatarEntity, (avatar) => avatar.user, { cascade: true, nullable: true })
    @JoinColumn()
    avatar: AvatarEntity;
}