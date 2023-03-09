import { Role } from "../auth/auth.models"
import { UserController } from "./user.controller"
import { User } from "./user.models"
import { UserService } from "./user.service"

describe("Modules > User > Controllers", () => {
    const mockUserService = {
        create: jest.fn(),
    }

    describe("UserController", () => {
        describe("createUser", () => {
            // Happy
            it("creates a user", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                mockUserService.create.mockResolvedValue(mockUser)
                const controller = new UserController(
                    mockUserService as unknown as UserService,
                )

                // Test
                const result = await controller.createUser({
                    username: mockUser.username,
                    password: "password",
                    role: Role.Manager,
                })

                expect(result).toEqual(mockUser)
            })
        })
    })
})
