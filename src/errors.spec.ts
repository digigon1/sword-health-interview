import { ForbiddenError, NotFoundError } from "./errors"

describe("Errors", () => {
    describe("NotFoundError", () => {
        it("creates", () => {
            const error = new NotFoundError()
            expect(error).toBeInstanceOf(NotFoundError)
        })
    })

    describe("ForbiddenError", () => {
        it("creates", () => {
            const error = new ForbiddenError()
            expect(error).toBeInstanceOf(ForbiddenError)
        })
    })
})
