import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "../user/user.models"
import { LoginDto, Role } from "./auth.models"
import * as bcrypt from "bcrypt"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public async validateAuth(input: LoginDto): Promise<User | null> {
        try {
            // Gets user by username
            const user = await this.userService.getByUsername(input.username)

            // Checks user password
            if (await bcrypt.compare(input.password, user.password)) {
                // Drop password from result
                const { password, ...result } = user
                return result
            }

            // Return null is details are wrong
            return null
        } catch (e) {
            return null
        }
    }

    public async login(user: User): Promise<{ access_token: string }> {
        // Create JWT token
        return {
            access_token: this.jwtService.sign({
                username: user.username,
                sub: user.id,
            }),
        }
    }

    // Simple check, but this can be extended easily
    public hasAdminRole(user: User): boolean {
        return user.role === Role.Manager
    }
}
