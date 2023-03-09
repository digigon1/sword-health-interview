import { JwtService } from "@nestjs/jwt"
import { User } from "../user/user.models"
import { UserService } from "../user/user.service"
import { Role } from "./auth.models"
import { AuthService } from "./auth.service"
import * as bcrypt from "bcrypt"
import * as dotenv from "dotenv"
import { NotFoundError } from "../../errors"

describe("Modules > Auth > Service", () => {
    describe("AuthService", () => {
        describe("validateAuth", () => {
            // Happy
            it("validates login", async () => {
                // Setup
                dotenv.config()

                const mockInput = {
                    username: "username",
                    password: "password",
                }
                const hashedPassword = bcrypt.hashSync(
                    mockInput.password,
                    +process.env.SALT_ROUNDS,
                )
                const mockUserService: UserService = {
                    getByUsername: jest.fn((username) => {
                        const result = new User({
                            id: 1,
                            username,
                            role: Role.Manager,
                        })
                        result.password = hashedPassword
                        return Promise.resolve(result)
                    }),
                } as unknown as UserService
                const authService = new AuthService(
                    mockUserService,
                    {} as JwtService,
                )

                // Test
                const result = await authService.validateAuth(mockInput)

                expect(result).toEqual({
                    id: 1,
                    username: mockInput.username,
                    role: Role.Manager,
                })
            })

            // Sad
            it("fails if password is wrong", async () => {
                // Setup
                dotenv.config()

                const mockInput = {
                    username: "username",
                    password: "password",
                }
                const mockUserService: UserService = {
                    getByUsername: jest.fn((username) => {
                        const result = new User({
                            id: 1,
                            username,
                            role: Role.Manager,
                        })
                        result.password = ""
                        return Promise.resolve(result)
                    }),
                } as unknown as UserService
                const authService = new AuthService(
                    mockUserService,
                    {} as JwtService,
                )

                // Test
                const result = await authService.validateAuth(mockInput)

                expect(result).toBe(null)
            })

            it("fails if user does not exist", async () => {
                // Setup
                dotenv.config()

                const mockInput = {
                    username: "username",
                    password: "password",
                }
                const mockUserService: UserService = {
                    getByUsername: jest.fn((username) =>
                        Promise.reject(new NotFoundError()),
                    ),
                } as unknown as UserService
                const authService = new AuthService(
                    mockUserService,
                    {} as JwtService,
                )

                // Test
                const result = await authService.validateAuth(mockInput)

                expect(result).toBe(null)
            })
        })

        describe("login", () => {
            // Happy
            it("returns access token", async () => {
                // Setup
                dotenv.config()

                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const mockJwtService: JwtService = {
                    sign: (obj: { username: string; sub: number }) =>
                        `sub: ${obj.sub} username: ${obj.username}`,
                } as unknown as JwtService
                const authService = new AuthService(
                    {} as UserService,
                    mockJwtService,
                )

                // Test
                const result = await authService.login(mockUser)

                expect(result).toEqual({
                    access_token: `sub: ${mockUser.id} username: ${mockUser.username}`,
                })
            })
        })

        describe("hasAdminRole", () => {
            // Happy
            it("checks that user is admin", () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const authService = new AuthService(
                    {} as UserService,
                    {} as JwtService,
                )

                const result = authService.hasAdminRole(mockUser)

                expect(result).toBeTruthy()
            })

            it("checks that user is not admin", () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Technician,
                })
                const authService = new AuthService(
                    {} as UserService,
                    {} as JwtService,
                )

                const result = authService.hasAdminRole(mockUser)

                expect(result).toBeFalsy()
            })
        })
    })
})
