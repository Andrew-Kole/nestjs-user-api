export interface IUserModel {
    id?: number;
    nickname: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt?: Date;
}