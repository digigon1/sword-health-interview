import { validateSync } from "class-validator"
import { CreateTaskDTO, Task, UpdateTaskDTO } from "./task.models"

describe("Modules > Task > Models", () => {
    describe("Task", () => {
        // Happy
        it("creates", () => {
            const input: Task = {
                id: 1,
                userId: 1,
                summary: "summary",
            }
            let task = new Task(input)
            expect(task).toEqual(input)
            expect(validateSync(task).length).toBe(0)

            input.performedAt = new Date()
            task = new Task(input)
            expect(task).toEqual(input)
            expect(validateSync(task).length).toBe(0)
        })

        // Sad
        it("fails if summary is over 2500 chars long", () => {
            const input: Task = {
                id: 1,
                userId: 1,
                summary: "a".repeat(2501),
            }
            let task = new Task(input)
            expect(task).toEqual(input)
            expect(validateSync(task).length).toBe(1)
        })
    })

    describe("CreateTaskDTO", () => {
        // Happy
        it("creates", () => {
            const input: CreateTaskDTO = {
                summary: "summary",
            }
            let createTask = new CreateTaskDTO(input)
            expect(createTask).toEqual(input)
            expect(validateSync(createTask).length).toBe(0)

            const emptyCreateTask = new CreateTaskDTO()
            expect(emptyCreateTask).toBeInstanceOf(CreateTaskDTO)
        })

        // Sad
        it("fails if summary is over 2500 chars long", () => {
            const input: CreateTaskDTO = {
                summary: "a".repeat(2501),
            }
            let createTask = new CreateTaskDTO(input)
            expect(createTask).toEqual(input)
            expect(validateSync(createTask).length).toBe(1)
        })
    })

    describe("UpdateTaskDTO", () => {
        // Happy
        it("creates", () => {
            const input: UpdateTaskDTO = {
                summary: "summary",
            }
            let createTask = new UpdateTaskDTO(input)
            expect(createTask).toEqual(input)
            expect(validateSync(createTask).length).toBe(0)

            const emptyUpdateTask = new UpdateTaskDTO()
            expect(emptyUpdateTask).toBeInstanceOf(UpdateTaskDTO)
        })

        // Sad
        it("fails if summary is over 2500 chars long", () => {
            const input: UpdateTaskDTO = {
                summary: "a".repeat(2501),
            }
            let createTask = new UpdateTaskDTO(input)
            expect(createTask).toEqual(input)
            expect(validateSync(createTask).length).toBe(1)
        })
    })
})
