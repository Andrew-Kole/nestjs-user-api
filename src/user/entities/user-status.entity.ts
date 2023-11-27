import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserRoleEnum} from "../../common/enums/user.role.enum";
import {UserEntity} from "./user.entity";

@Entity('user_status')
export class UserStatusEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BASIC})
    role: UserRoleEnum;

    @Column({default: false})
    isDeleted: boolean;

    @Column({default: true})
    isActive: boolean;

    @Column({nullable: true})
    refreshToken: string

    @OneToOne(() => UserEntity, (user) => user.status, )
    user: UserEntity;
}