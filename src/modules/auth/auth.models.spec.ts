import { validateSync } from "class-validator"
import { LoginDto } from "./auth.models"

describe("Modules > Auth > Models", () => {
    describe("LoginDto", () => {
        it("creates", () => {
            const input: LoginDto = {
                username: "username",
                password: "pasword",
            }
            const loginDto = new LoginDto(input)
            expect(loginDto).toEqual(input)
            expect(validateSync(loginDto).length).toBe(0)

            const emptyLoginDto = new LoginDto()
            expect(emptyLoginDto).toBeInstanceOf(LoginDto)
        })
    })
})
