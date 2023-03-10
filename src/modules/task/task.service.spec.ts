import { User } from "../user/user.models"
import { ForbiddenError, NotFoundError } from "../../errors"
import { DatabaseService, Table } from "../../providers/database"
import { NotificationService } from "../../providers/notification"
import { Task } from "./task.models"
import { TaskService } from "./task.service"
import { Role } from "../auth/auth.models"
import { TaskCompletedError } from "./task.error"

describe("Modules > Task > Service", () => {
    describe("TaskService", () => {
        const mockDatabaseService = {
            select: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }

        const mockNotificationService = {
            sendTaskCompleteNotification: jest.fn(),
        }

        describe("get", () => {
            // Happy
            it("gets task", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: 1,
                    summary: "summary",
                })
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                const task = await taskService.get(mockTask.id)

                expect(task).toEqual(mockTask)
            })

            // Sad
            it("fails if task does not exist", async () => {
                // Setup
                mockDatabaseService.select.mockResolvedValueOnce([])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(taskService.get(1)).rejects.toThrow(NotFoundError)
            })
        })

        describe("create", () => {
            // Happy
            it("creates task", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockTask = new Task({
                    id: 1,
                    userId: mockUser.id,
                    summary: "summary",
                })
                mockDatabaseService.insert.mockResolvedValueOnce(mockTask.id)
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                const task = await taskService.create(mockTask, mockUser)

                expect(task).toBe(mockTask)
            })
        })

        describe("getAll", () => {
            // Happy
            it("gets all tasks", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: 1,
                    summary: "summary",
                })
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                const tasks = await taskService.getAll()

                expect(tasks).toHaveLength(1)
                expect(tasks[0]).toEqual(mockTask)
            })

            it("gets all tasks for single user", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: 1,
                    summary: "summary",
                })
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                const tasks = await taskService.getAll(1)

                expect(tasks).toHaveLength(1)
                expect(tasks[0]).toEqual(mockTask)
            })
        })

        describe("delete", () => {
            // Happy
            it("deletes a task", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: 1,
                    summary: "summary",
                })
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await taskService.delete(mockTask.id)

                expect(mockDatabaseService.delete).toBeCalledWith(Table.Tasks, {
                    id: mockTask.id,
                })
            })

            // Sad
            it("fails if task does not exist", async () => {
                // Setup
                mockDatabaseService.select.mockResolvedValueOnce([])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(taskService.delete(1)).rejects.toThrow(
                    NotFoundError,
                )
            })
        })

        describe("changeSummary", () => {
            // Happy
            it("changes a task's summary", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockTask = new Task({
                    id: 1,
                    userId: mockUser.id,
                    summary: "summary",
                })
                mockDatabaseService.select
                    .mockResolvedValueOnce([mockTask])
                    .mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                const task = await taskService.changeSummary(
                    mockTask.id,
                    mockUser,
                    "summary",
                )

                expect(task).toEqual(mockTask)
            })

            // Sad
            it("fails if task does not exist", async () => {
                // Setup
                mockDatabaseService.select.mockResolvedValueOnce([])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(
                    taskService.changeSummary(1, {} as User, "summary"),
                ).rejects.toThrow(NotFoundError)
            })

            it("fails if user does not have access to task", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockTask = new Task({
                    id: 1,
                    userId: 2,
                    summary: "summary",
                })
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(
                    taskService.changeSummary(mockTask.id, mockUser, "summary"),
                ).rejects.toThrow(ForbiddenError)
            })
        })

        describe("complete", () => {
            // Happy
            it("completes a task", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockTask = new Task({
                    id: 1,
                    userId: mockUser.id,
                    summary: "summary",
                })
                mockDatabaseService.select
                    .mockResolvedValueOnce([mockTask])
                    .mockResolvedValueOnce([mockTask])
                    .mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                const task = await taskService.complete(mockTask.id, mockUser)

                expect(task).toEqual(mockTask)

                expect(
                    mockNotificationService.sendTaskCompleteNotification,
                ).toBeCalledWith(mockUser, mockTask)
            })

            // Sad
            it("fails if task does not exist", async () => {
                // Setup
                mockDatabaseService.select.mockResolvedValueOnce([])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(
                    taskService.complete(1, {} as User),
                ).rejects.toThrow(NotFoundError)
            })

            it("fails if task is completed", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockTask = new Task({
                    id: 1,
                    userId: mockUser.id,
                    summary: "summary",
                    performedAt: new Date(),
                })
                mockDatabaseService.select.mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(
                    taskService.complete(mockTask.id, mockUser),
                ).rejects.toThrow(TaskCompletedError)
            })

            it("fails if user does not have access to task", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockTask = new Task({
                    id: 1,
                    userId: 2,
                    summary: "summary",
                })
                mockDatabaseService.select
                    .mockResolvedValueOnce([mockTask])
                    .mockResolvedValueOnce([mockTask])
                const taskService = new TaskService(
                    mockDatabaseService as unknown as DatabaseService,
                    mockNotificationService as unknown as NotificationService,
                )

                await expect(
                    taskService.complete(mockTask.id, mockUser),
                ).rejects.toThrow(ForbiddenError)
            })
        })
    })
})
