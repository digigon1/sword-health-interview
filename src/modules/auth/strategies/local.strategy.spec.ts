import { UnauthorizedException } from "@nestjs/common"
import { User } from "../../user/user.models"
import { Role } from "../auth.models"
import { AuthService } from "../auth.service"
import { LocalStrategy } from "./local.strategy"

describe("Modules > Auth > Strategies > Local", () => {
    describe("LocalStrategy", () => {
        describe("validate", () => {
            // Happy
            it("gets the user if it exists", async () => {
                // Setup
                const mockUsername = "test"
                const mockAuthService: AuthService = {
                    validateAuth: jest.fn(({ username, password }) =>
                        Promise.resolve(
                            new User({
                                id: 1,
                                username,
                                role: Role.Manager,
                            }),
                        ),
                    ),
                } as unknown as AuthService
                const strategy = new LocalStrategy(mockAuthService)

                // Test
                const result = await strategy.validate(mockUsername, "")
                expect(result).toEqual({
                    id: 1,
                    username: mockUsername,
                    role: Role.Manager,
                })
            })

            // Sad
            it("fails if user does not exist", async () => {
                // Setup
                const mockUsername = "test"
                const mockAuthService: AuthService = {
                    validateAuth: jest.fn((username) => Promise.resolve(null)),
                } as unknown as AuthService
                const strategy = new LocalStrategy(mockAuthService)

                // Test
                await expect(
                    strategy.validate(mockUsername, ""),
                ).rejects.toThrow(UnauthorizedException)
            })
        })
    })
})
