import { JwtAuthGuard } from "./jwt.guard"

describe("Modules > Auth > Guards > JWT", () => {
    describe("JwtAuthGuard", () => {
        // Code is not mine, therefore only thing we should do as a unit test is instance it
        it("creates", () => {
            const guard = new JwtAuthGuard()

            expect(guard).toBeInstanceOf(JwtAuthGuard)
        })
    })
})
