import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./modules/auth/auth.module"
import { TaskModule } from "./modules/task/task.module"
import { UserModule } from "./modules/user/user.module"

@Module({
    imports: [
        // Imports env
        ConfigModule.forRoot({ isGlobal: true }),
        TaskModule,
        UserModule,
        AuthModule,
    ],
})
export class AppModule {}
