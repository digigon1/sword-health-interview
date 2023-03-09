import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "../auth.service"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
    }

    async validate(username: string, password: string): Promise<any> {
        // Gets user if login details are correct, null otherwise
        const user = await this.authService.validateAuth({
            username,
            password,
        })

        // Fail for incorrect details
        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
