import {
    Body,
    ConflictException,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common"
import { Request } from "express"
import { NotFoundError, ForbiddenError } from "../../errors"
import { Role } from "../auth/auth.models"
import { AuthService } from "../auth/auth.service"
import { Roles } from "../auth/decorators/roles.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/role.guard"
import { User } from "../user/user.models"
import { TaskCompletedError } from "./task.error"
import { CreateTaskDTO, Task, UpdateTaskDTO } from "./task.models"
import { TaskService } from "./task.service"

@Controller("task")
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get("/")
    public async listTasks(@Req() req: Request): Promise<Task[]> {
        // Get user from request
        const user = req.user as User

        // If user is admin...
        if (this.authService.hasAdminRole(user)) {
            // ...we can get all tasks
            return this.taskService.getAll()
        } else {
            // ...else, just return tasks for user
            return this.taskService.getAll(user.id)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("/")
    public async createTask(
        @Body() task: CreateTaskDTO,
        @Req() req: Request,
    ): Promise<Task> {
        // Get user from request
        const user = req.user as User

        // Create task for user
        return this.taskService.create(task, user)
    }

    // RolesGuard + Roles = Only Role.Manager user can call this
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete("/:id")
    @Roles(Role.Manager)
    public async deleteTask(@Param("id") id: number): Promise<void> {
        try {
            // Delete task
            return await this.taskService.delete(id)
        } catch (e) {
            // Handle known errors
            if (e instanceof NotFoundError) {
                // 404
                throw new NotFoundException()
            }

            // Handle unknown errors
            throw new InternalServerErrorException() // 500
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/:id/summary")
    public async updateTaskSummary(
        @Param("id") id: number,
        @Body() task: UpdateTaskDTO,
        @Req() req: Request,
    ): Promise<Task> {
        try {
            // Get user from request
            const user = req.user as User

            // Change task summary
            const result = await this.taskService.changeSummary(
                id,
                user,
                task.summary,
            )

            return result
        } catch (e) {
            // Handle known errors
            if (e instanceof NotFoundError) {
                // 404
                throw new NotFoundException()
            }

            if (e instanceof ForbiddenError) {
                // 403, happens if user does not have access to the task
                throw new ForbiddenException()
            }

            // Handle unknown errors
            throw new InternalServerErrorException() // 500
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("/:id/complete")
    public async completeTask(
        @Param("id") id: number,
        @Req() req: Request,
    ): Promise<Task> {
        try {
            // Get user from request
            const user = req.user as User

            // Complete task
            const result = await this.taskService.complete(id, user)

            return result
        } catch (e) {
            // Handle known errors
            if (e instanceof NotFoundError) {
                // 404
                throw new NotFoundException()
            }

            if (e instanceof ForbiddenError) {
                // 403, happens if user does not have access to the task
                throw new ForbiddenException()
            }

            if (e instanceof TaskCompletedError) {
                // 409, happens if task is already completed
                throw new ConflictException()
            }

            // Handle unknown errors
            throw new InternalServerErrorException() // 500
        }
    }
}
