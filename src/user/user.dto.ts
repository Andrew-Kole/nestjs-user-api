export class CreateUserDto {
    nickname: string;
    firstName: string;
    lastName: string;
    password: string;
}

export class ResponseUserDto {
    id: number;
    nickname: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
}