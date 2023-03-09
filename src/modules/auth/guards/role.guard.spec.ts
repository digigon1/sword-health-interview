import { ExecutionContext } from "@nestjs/common"
import { HttpArgumentsHost } from "@nestjs/common/interfaces"
import { Reflector } from "@nestjs/core"
import { Role } from "../auth.models"
import { RolesGuard } from "./role.guard"

describe("Modules > Auth > Guards > Role", () => {
    describe("RolesGuard", () => {
        describe("canActivate", () => {
            // Happy
            it("has the required role for given user", () => {
                // Setup
                const reflector = new Reflector()
                jest.spyOn(reflector, "getAllAndOverride").mockReturnValueOnce([
                    Role.Manager,
                ])

                const ctx: ExecutionContext = {
                    getHandler: jest.fn(),
                    getClass: jest.fn(),
                    switchToHttp: jest.fn(
                        () =>
                            ({
                                getRequest: jest.fn(() => ({
                                    user: {
                                        role: Role.Manager,
                                    },
                                })),
                            } as unknown as HttpArgumentsHost),
                    ),
                } as unknown as ExecutionContext

                // Test
                const guard = new RolesGuard(reflector)
                const result = guard.canActivate(ctx)

                expect(result).toBeTruthy()
            })

            it("does not have the required role for given user", () => {
                // Setup
                const reflector = new Reflector()
                jest.spyOn(reflector, "getAllAndOverride").mockReturnValueOnce([
                    Role.Technician,
                ])

                const ctx: ExecutionContext = {
                    getHandler: jest.fn(),
                    getClass: jest.fn(),
                    switchToHttp: jest.fn(
                        () =>
                            ({
                                getRequest: jest.fn(() => ({
                                    user: {
                                        role: Role.Manager,
                                    },
                                })),
                            } as unknown as HttpArgumentsHost),
                    ),
                } as unknown as ExecutionContext

                // Test
                const guard = new RolesGuard(reflector)
                const result = guard.canActivate(ctx)

                expect(result).toBeFalsy()
            })

            // Sad
            it("fails gracefully if context does not have roles assigned", () => {
                // Setup
                const reflector = new Reflector()
                jest.spyOn(reflector, "getAllAndOverride").mockReturnValueOnce(
                    undefined,
                )

                const ctx: ExecutionContext = {
                    getHandler: jest.fn(),
                    getClass: jest.fn(),
                    switchToHttp: jest.fn(
                        () =>
                            ({
                                getRequest: jest.fn(() => ({
                                    user: {
                                        role: Role.Manager,
                                    },
                                })),
                            } as unknown as HttpArgumentsHost),
                    ),
                } as unknown as ExecutionContext

                // Test
                const guard = new RolesGuard(reflector)
                const result = guard.canActivate(ctx)

                expect(result).toBeTruthy()
            })
        })
    })
})
