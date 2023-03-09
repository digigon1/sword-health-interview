import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

describe("Modules > Auth > Controllers", () => {
    describe("AuthController", () => {
        describe("login", () => {
            // Happy
            it("runs login", async () => {
                // Setup
                const mockAccessToken = "test"
                const mockAuthService: AuthService = {
                    login: jest.fn(() => ({ access_token: mockAccessToken })),
                } as unknown as AuthService
                const controller = new AuthController(mockAuthService)

                // Test
                const result = await controller.login({})
                expect(result).toEqual({ access_token: mockAccessToken })
            })
        })
    })
})
