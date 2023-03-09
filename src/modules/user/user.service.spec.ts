import { CreateUserDTO, User } from "./user.models"
import { NotFoundError } from "../../errors"
import { DatabaseService } from "../../providers/database"
import { Role } from "../auth/auth.models"
import { UserService } from "./user.service"

describe("Modules > User > Service", () => {
    describe("UserService", () => {
        const mockDatabaseService = {
            select: jest.fn(),
            insert: jest.fn(),
        }

        describe("get", () => {
            // Happy
            it("gets user by id", async () => {
                // Setup
                const mockUser: User = {
                    id: 1,
                    username: "username",
                    password: "password",
                    role: Role.Manager,
                }
                mockDatabaseService.select.mockResolvedValueOnce([mockUser])
                const userService = new UserService(
                    mockDatabaseService as unknown as DatabaseService,
                )

                const user = await userService.get(mockUser.id)

                expect(user).toEqual(mockUser)
            })

            // Sad
            it("fails if user does not exist", async () => {
                // Setup
                mockDatabaseService.select.mockResolvedValueOnce([])
                const userService = new UserService(
                    mockDatabaseService as unknown as DatabaseService,
                )

                await expect(userService.get(1)).rejects.toThrow(NotFoundError)
            })
        })

        describe("create", () => {
            // Happy
            it("creates user", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const createUser: CreateUserDTO = {
                    username: mockUser.username,
                    password: "password",
                    role: mockUser.role,
                }
                mockDatabaseService.insert.mockResolvedValueOnce(mockUser.id)
                mockDatabaseService.select.mockResolvedValueOnce([mockUser])
                const userService = new UserService(
                    mockDatabaseService as unknown as DatabaseService,
                )

                const user = await userService.create(createUser)

                expect(user).toEqual(mockUser)
            })
        })

        describe("getByUsername", () => {
            // Happy
            it("gets user by username", async () => {
                // Setup
                const mockUser: User = {
                    id: 1,
                    username: "username",
                    password: "password",
                    role: Role.Manager,
                }
                mockDatabaseService.select.mockResolvedValueOnce([mockUser])
                const userService = new UserService(
                    mockDatabaseService as unknown as DatabaseService,
                )

                const user = await userService.getByUsername(mockUser.username)

                expect(user).toEqual(mockUser)
            })

            // Sad
            it("fails if user does not exist", async () => {
                // Setup
                mockDatabaseService.select.mockResolvedValueOnce([])
                const userService = new UserService(
                    mockDatabaseService as unknown as DatabaseService,
                )

                await expect(userService.getByUsername("fail")).rejects.toThrow(
                    NotFoundError,
                )
            })
        })
    })
})
