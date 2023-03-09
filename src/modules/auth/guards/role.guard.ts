import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { User } from "../../user/user.models"
import { Role } from "../auth.models"
import { ROLES_KEY } from "../decorators/roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Retrieves roles metadata
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        )

        // Passes if no role is required
        if (!requiredRoles) {
            return true
        }

        // Gets user from request
        const { user } = context.switchToHttp().getRequest()

        // Checks if user has needed role
        return requiredRoles.some((role) => (user as User).role === role)
    }
}
