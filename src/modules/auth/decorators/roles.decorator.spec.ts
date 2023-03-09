import { Reflector } from "@nestjs/core"
import { Role } from "../auth.models"
import { Roles, ROLES_KEY } from "./roles.decorator"

describe("Auth > Decorators > Roles", () => {
    // Happy
    describe("Roles", () => {
        it("sets the metadata correctly", async () => {
            let role: Role = Role.Manager
            // Setup
            class Test1 {
                @Roles(role)
                public static a() {}
            }
            const reflector = new Reflector()

            // Check if metadata was set
            let roleList = reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                Test1.a,
                Test1,
            ])
            expect(roleList).toHaveLength(1)
            expect(roleList[0]).toBe(role)

            // Check for different role
            role = Role.Technician
            class Test2 {
                @Roles(role)
                public static a() {}
            }

            roleList = reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                Test2.a,
                Test2,
            ])
            expect(roleList).toHaveLength(1)
            expect(roleList[0]).toBe(role)
        })
    })
})
