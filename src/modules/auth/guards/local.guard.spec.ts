import { LocalAuthGuard } from "./local.guard"

describe("Modules > Auth > Guards > Local", () => {
    describe("LocalAuthGuard", () => {
        // Code is not mine, therefore only thing we should do as a unit test is instance it
        it("creates", () => {
            const guard = new LocalAuthGuard()
            expect(guard).toBeInstanceOf(LocalAuthGuard)
        })
    })
})
