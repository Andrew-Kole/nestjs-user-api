import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {JwtAuthService} from "./jwt-auth.service";
import {AuthResponse} from "./jwt-auth.types";
import {LoginInput} from "./jwt-auth.input";

@Resolver()
export class JwtAuthResolver {
    constructor(
        private readonly jwtAuthService: JwtAuthService
    ) {}

    @Mutation(() => AuthResponse)
    async login(@Args('loginDto') loginDto: LoginInput): Promise<AuthResponse> {
        return this.jwtAuthService.login(loginDto);
    }
}