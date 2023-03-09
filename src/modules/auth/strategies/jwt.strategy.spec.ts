import { NotFoundError } from "../../../errors"
import { User } from "../../user/user.models"
import { UserService } from "../../user/user.service"
import { Role } from "../auth.models"
import { JwtStrategy } from "./jwt.strategy"

describe("Modules > Auth > Strategies > JWT", () => {
    describe("JwtStrategy", () => {
        describe("validate", () => {
            // Happy
            it("gets the user if it exists", async () => {
                // Setup
                const mockUsername = "test"
                const mockUserService: UserService = {
                    getByUsername: jest.fn((username) =>
                        Promise.resolve(
                            new User({
                                id: 1,
                                username,
                                role: Role.Manager,
                            }),
                        ),
                    ),
                } as unknown as UserService
                process.env.JWT_SECRET = "test"
                const strategy = new JwtStrategy(mockUserService)

                // Test
                const result = await strategy.validate({
                    username: mockUsername,
                })
                expect(result).toEqual({
                    id: 1,
                    username: mockUsername,
                    role: Role.Manager,
                })

                // Cleanup
                delete process.env.JWT_SECRET
            })

            // Sad
            it("fails if user does not exist", async () => {
                // Setup
                const mockUsername = "test"
                const mockUserService: UserService = {
                    getByUsername: jest.fn((username) =>
                        Promise.reject(new NotFoundError()),
                    ),
                } as unknown as UserService
                process.env.JWT_SECRET = "test"
                const strategy = new JwtStrategy(mockUserService)

                // Test
                await expect(
                    strategy.validate({ username: mockUsername }),
                ).rejects.toThrow(NotFoundError)

                // Cleanup
                delete process.env.JWT_SECRET
            })
        })
    })
})
