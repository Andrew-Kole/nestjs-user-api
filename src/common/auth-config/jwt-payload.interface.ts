export interface JwtPayload {
    id: number;
    role: string;
    iat?: number;
    exp?: number;
}