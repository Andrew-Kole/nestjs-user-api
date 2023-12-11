import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";

@Entity('avatars')
export class AvatarEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => UserEntity, (user) => user.avatar)
    user: number;
}