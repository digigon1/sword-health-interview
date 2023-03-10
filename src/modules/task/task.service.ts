import { Injectable } from "@nestjs/common"
import { ForbiddenError, NotFoundError } from "../../errors"
import { DatabaseService, Table } from "../../providers/database"
import { NotificationService } from "../../providers/notification"
import { User } from "../user/user.models"
import { TaskCompletedError } from "./task.error"
import { CreateTaskDTO, Task } from "./task.models"

@Injectable()
export class TaskService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly notificationService: NotificationService,
    ) {}

    public async get(id: Task["id"]): Promise<Task> {
        // Get task from DB
        const dbTask = await this.databaseService.select(Table.Tasks, { id })
        if (!dbTask.length) {
            // Length = 0
            throw new NotFoundError() // Task does not exist
        }

        return dbTask[0]
    }

    public async create(task: CreateTaskDTO, user: User): Promise<Task> {
        // Create task
        const id = await this.databaseService.insert(Table.Tasks, {
            ...task,
            userId: user.id,
        })

        // Get and return task we just created
        return this.get(id)
    }

    public async getAll(userId?: User["id"]): Promise<Task[]> {
        const where: Partial<Task> = {}
        if (userId) {
            // Get for single user
            where.userId = userId
        }

        // Get tasks
        return this.databaseService.select(Table.Tasks, where)
    }

    public async delete(id: Task["id"]): Promise<void> {
        // Check task exists
        await this.get(id)

        // Delete task
        await this.databaseService.delete(Table.Tasks, { id })
    }

    private async update(
        id: Task["id"],
        user: User,
        task: Partial<Task>,
    ): Promise<Task> {
        // Check task exists
        const dbTask = await this.get(id)

        // Check user is correct
        if (dbTask.userId !== user.id) {
            throw new ForbiddenError()
        }

        // Update and return updated task
        await this.databaseService.update(Table.Tasks, task, {
            id,
        })
        return this.get(id)
    }

    public async changeSummary(
        id: Task["id"],
        user: User,
        summary: Task["summary"],
    ): Promise<Task> {
        // Call update with given summary
        return this.update(id, user, { summary })
    }

    public async complete(id: Task["id"], user: User): Promise<Task> {
        // Check task exists
        const dbTask = await this.get(id)

        // Check task is complete
        if (dbTask.performedAt) {
            throw new TaskCompletedError()
        }

        // Call update with current date
        const result = await this.update(id, user, {
            performedAt: new Date(),
        })

        // Send notification asynchronously
        this.notificationService.sendTaskCompleteNotification(user, result)

        return result
    }
}
