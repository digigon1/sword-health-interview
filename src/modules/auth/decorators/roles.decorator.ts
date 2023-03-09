import { SetMetadata } from "@nestjs/common"
import { Role } from "../auth.models"

export const ROLES_KEY = "roles"
// Sets roles metadata for function this decorates
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
