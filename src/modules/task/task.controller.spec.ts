import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common"
import { Request } from "express"
import { ForbiddenError, NotFoundError } from "../../errors"
import { Role } from "../auth/auth.models"
import { AuthService } from "../auth/auth.service"
import { User } from "../user/user.models"
import { TaskController } from "./task.controller"
import { TaskCompletedError } from "./task.error"
import { Task } from "./task.models"
import { TaskService } from "./task.service"

describe("Modules > Task > Controllers", () => {
    const mockTaskService = {
        getAll: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        changeSummary: jest.fn(),
        complete: jest.fn(),
    }
    const mockAuthService = {
        hasAdminRole: jest.fn(),
    }
    const mockRequest = {
        user: new User({
            id: 1,
            username: "username",
            role: Role.Manager,
        }),
    } as unknown as Request

    describe("TaskController", () => {
        describe("listTasks", () => {
            // Happy
            it("lists all tasks if user is manager", async () => {
                // Setup
                mockAuthService.hasAdminRole.mockReturnValueOnce(true)
                const mockTaskList = [
                    new Task({
                        id: 1,
                        userId: 1,
                        summary: "summary",
                    }),
                ]
                mockTaskService.getAll.mockReturnValueOnce(mockTaskList)
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                // Test
                const result = await controller.listTasks(mockRequest)

                expect(result).toEqual(mockTaskList)
                expect(mockTaskService.getAll).toBeCalledWith()
            })

            it("lists all tasks for user if user is not manager", async () => {
                mockAuthService.hasAdminRole.mockReturnValueOnce(false)
                const mockTaskList = [
                    new Task({
                        id: 1,
                        userId: 1,
                        summary: "summary",
                    }),
                ]
                mockTaskService.getAll.mockReturnValueOnce(mockTaskList)
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                // Test
                const result = await controller.listTasks(mockRequest)

                expect(result).toEqual(mockTaskList)
                expect(mockTaskService.getAll).toBeCalledWith(
                    (mockRequest.user as User).id,
                )
            })
        })

        describe("createTask", () => {
            // Happy
            it("creates a new task", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: (mockRequest.user as User).id,
                    summary: "summary",
                })
                mockTaskService.create.mockReturnValueOnce(mockTask)
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                const result = await controller.createTask(
                    { summary: mockTask.summary },
                    mockRequest,
                )

                expect(result).toEqual(mockTask)
            })
        })

        describe("deleteTask", () => {
            // Happy
            it("deletes a task", async () => {
                // Setup
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )
                const mockTaskID = 1

                const result = await controller.deleteTask(mockTaskID)

                expect(mockTaskService.delete).toBeCalledWith(mockTaskID)
            })

            // Sad
            it("fails if task does not exist", async () => {
                mockTaskService.delete.mockRejectedValueOnce(
                    new NotFoundError(),
                )
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )
                const mockTaskID = 1

                await expect(controller.deleteTask(mockTaskID)).rejects.toThrow(
                    NotFoundException,
                )
            })
        })

        describe("updateTaskSummary", () => {
            // Happy
            it("updates the task's summary", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: (mockRequest.user as User).id,
                    summary: "summary",
                })
                mockTaskService.changeSummary.mockResolvedValueOnce(mockTask)
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                const result = await controller.updateTaskSummary(
                    mockTask.id,
                    { summary: mockTask.summary },
                    mockRequest,
                )

                expect(result).toEqual(mockTask)
            })

            // Sad
            it("fails if task is not found", async () => {
                // Setup
                mockTaskService.changeSummary.mockRejectedValueOnce(
                    new NotFoundError(),
                )
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                await expect(
                    controller.updateTaskSummary(
                        1,
                        { summary: "summary" },
                        mockRequest,
                    ),
                ).rejects.toThrow(NotFoundException)
            })

            it("fails if user does not have permission to update task", async () => {
                // Setup
                mockTaskService.changeSummary.mockRejectedValueOnce(
                    new ForbiddenError(),
                )
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                await expect(
                    controller.updateTaskSummary(
                        1,
                        { summary: "summary" },
                        mockRequest,
                    ),
                ).rejects.toThrow(ForbiddenException)
            })
        })

        describe("completeTask", () => {
            // Happy
            it("completes a task", async () => {
                // Setup
                const mockTask = new Task({
                    id: 1,
                    userId: (mockRequest.user as User).id,
                    summary: "summary",
                })
                mockTaskService.complete.mockResolvedValueOnce(mockTask)
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                const result = await controller.completeTask(
                    mockTask.id,
                    mockRequest,
                )

                expect(result).toEqual(mockTask)
            })

            // Sad
            it("fails if task is not found", async () => {
                // Setup
                mockTaskService.complete.mockRejectedValueOnce(
                    new NotFoundError(),
                )
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                await expect(
                    controller.completeTask(1, mockRequest),
                ).rejects.toThrow(NotFoundException)
            })

            it("fails if user does not have permission to update task", async () => {
                // Setup
                mockTaskService.complete.mockRejectedValueOnce(
                    new ForbiddenError(),
                )
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                await expect(
                    controller.completeTask(1, mockRequest),
                ).rejects.toThrow(ForbiddenException)
            })

            it("fails if task is already completed", async () => {
                // Setup
                mockTaskService.complete.mockRejectedValueOnce(
                    new TaskCompletedError(),
                )
                const controller = new TaskController(
                    mockTaskService as unknown as TaskService,
                    mockAuthService as unknown as AuthService,
                )

                await expect(
                    controller.completeTask(1, mockRequest),
                ).rejects.toThrow(ConflictException)
            })
        })
    })
})
