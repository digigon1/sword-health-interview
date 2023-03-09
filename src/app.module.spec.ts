import { AppModule } from "./app.module"

describe("App > Module", () => {
    describe("AppModule", () => {
        it("creates", () => {
            const module = new AppModule()
            expect(module).toBeInstanceOf(AppModule)
        })
    })
})
