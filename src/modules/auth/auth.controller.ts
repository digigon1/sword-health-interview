import { Controller, Post, Request, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local.guard"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Uses guard for login details
    @UseGuards(LocalAuthGuard)
    @Post("/login")
    public async login(@Request() req): Promise<{ access_token: string }> {
        // After login successful, return JWT token
        return this.authService.login(req.user)
    }
}
