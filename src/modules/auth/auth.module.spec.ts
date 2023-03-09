import { AuthModule } from "./auth.module"

describe("Modules > Auth > Module", () => {
    describe("AuthModule", () => {
        it("creates", () => {
            const module = new AuthModule()
            expect(module).toBeInstanceOf(AuthModule)
        })
    })
})
