import { UserModule } from "./user.module"

describe("Modules > User > Module", () => {
    describe("UserModule", () => {
        it("creates", () => {
            const module = new UserModule()
            expect(module).toBeInstanceOf(UserModule)
        })
    })
})
