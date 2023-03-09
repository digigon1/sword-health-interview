import { Task } from "../modules/task/task.models"
import { Role } from "../modules/auth/auth.models"
import { User } from "../modules/user/user.models"
import { NotificationService } from "./notification"

const assertQueue = jest.fn()
const sendToQueue = jest.fn()
jest.mock("amqplib", () => ({
    connect: () =>
        Promise.resolve({
            createChannel: () =>
                Promise.resolve({
                    assertQueue,
                    sendToQueue,
                }),
        }),
}))

describe("Providers > Notification", () => {
    describe("NotificationService", () => {
        it("creates", () => {
            const service = new NotificationService()
            expect(service).toBeInstanceOf(NotificationService)
        })

        describe("sendTaskCompleteNotification", () => {
            // Happy
            it("sends task complete notification", async () => {
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
                const service = new NotificationService()
                process.env.TASK_QUEUE = "TASK_QUEUE"

                await service.sendTaskCompleteNotification(mockUser, mockTask)

                expect(assertQueue).toBeCalledWith(process.env.TASK_QUEUE)

                const buf = Buffer.from(
                    `The tech ${mockUser.username} performed the task ${
                        mockTask.summary
                    } on date ${mockTask.performedAt.toISOString()}`,
                )
                expect(sendToQueue).toBeCalledWith(process.env.TASK_QUEUE, buf)

                // Send second time, reuse channel
                assertQueue.mockReset()
                sendToQueue.mockReset()

                await service.sendTaskCompleteNotification(mockUser, mockTask)

                expect(assertQueue).not.toHaveBeenCalled()
                expect(sendToQueue).toBeCalledWith(process.env.TASK_QUEUE, buf)
            })
        })
    })
})
