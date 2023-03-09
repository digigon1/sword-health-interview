import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { DatabaseService } from "../../providers/database"
import { UserModule } from "../user/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { LocalStrategy } from "./strategies/local.strategy"

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async () => {
                // Need to wait for env variables to be loaded before using them
                await ConfigModule.envVariablesLoaded
                return {
                    secret: process.env.JWT_SECRET,
                }
            },
        }),
    ],
    controllers: [AuthController],
    providers: [DatabaseService, AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
