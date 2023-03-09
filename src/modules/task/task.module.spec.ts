import { TaskModule } from "./task.module"

describe("Modules > Task > Module", () => {
    describe("TaskModule", () => {
        it("creates", () => {
            const module = new TaskModule()
            expect(module).toBeInstanceOf(TaskModule)
        })
    })
})
