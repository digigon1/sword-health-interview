import { Module } from "@nestjs/common"
import { DatabaseService } from "../../providers/database"
import { NotificationService } from "../../providers/notification"
import { AuthModule } from "../auth/auth.module"
import { TaskController } from "./task.controller"
import { TaskService } from "./task.service"

@Module({
    imports: [AuthModule],
    controllers: [TaskController],
    providers: [TaskService, DatabaseService, NotificationService],
    exports: [TaskService],
})
export class TaskModule {}
