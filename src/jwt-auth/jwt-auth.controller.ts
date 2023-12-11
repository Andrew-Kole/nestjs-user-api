import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import {JwtAuthService} from "./jwt-auth.service";
import {LoginDto} from "./jwt-auth.dto";

@Controller('auth')
export class JwtAuthController {
    constructor(private readonly authService: JwtAuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        return this.authService.login(loginDto);
    }
}