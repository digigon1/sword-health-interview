import { TaskCompletedError } from "./task.error"

describe("Modules > Task > Error", () => {
    describe("TaskCompletedError", () => {
        it("creates", () => {
            const error = new TaskCompletedError()
            expect(error).toBeInstanceOf(TaskCompletedError)
        })
    })
})
