import { validateSync } from "class-validator"
import { Role } from "../auth/auth.models"
import { CreateUserDTO, User } from "./user.models"

describe("Modules > User > Models", () => {
    describe("User", () => {
        // Happy
        it("creates", () => {
            const input: User = {
                id: 1,
                username: "username",
                role: Role.Manager,
            }
            let user = new User(input)
            expect(user).toEqual(input)
            expect(validateSync(user).length).toBe(0)

            // Check if password is dropped
            user = new User({
                ...input,
                password: "password",
            })
            expect(user).toEqual(input)
            expect(validateSync(user).length).toBe(0)
        })
    })

    describe("CreateUserDTO", () => {
        // Happy
        it("creates", () => {
            const input: CreateUserDTO = {
                username: "username",
                password: "password",
                role: Role.Manager,
            }
            const createUser = new CreateUserDTO(input)
            expect(createUser).toEqual(input)
            expect(validateSync(createUser).length).toBe(0)

            const emptyCreateUser = new CreateUserDTO()
            expect(emptyCreateUser).toBeInstanceOf(CreateUserDTO)
        })

        // Sad
        it("fails if password in under 8 characters long", () => {
            const input: CreateUserDTO = {
                username: "username",
                password: "pw",
                role: Role.Manager,
            }
            const createUser = new CreateUserDTO(input)
            expect(createUser).toEqual(input)
            expect(validateSync(createUser).length).toBe(1)
        })
    })
})
