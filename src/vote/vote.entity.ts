import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";

@Entity('votes')
export class VoteEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @Column({type: 'int'})
    voter: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE'})
    @Column({type: 'int'})
    profile: number;

    @Column({ type: 'int', default: 0 })
    voteValue: number;

    @CreateDateColumn({ type: 'timestamp' })
    voteDate: Date;
}