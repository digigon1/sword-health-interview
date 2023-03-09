import { Module } from "@nestjs/common"
import { DatabaseService } from "../../providers/database"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
    imports: [],
    controllers: [UserController],
    providers: [DatabaseService, UserService],
    exports: [UserService],
})
export class UserModule {}
