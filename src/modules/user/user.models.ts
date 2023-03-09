import { IsEnum, IsInt, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "../auth/auth.models"

const ROLES = [Role.Manager, Role.Technician]

export class User {
    @IsInt()
    public id: number

    @IsString()
    public username: string

    @IsOptional()
    @IsString()
    public password?: string

    @IsEnum(ROLES)
    public role: Role

    public constructor(input: User) {
        this.id = input.id

        this.username = input.username

        this.role = input.role
    }
}

export class CreateUserDTO {
    @IsString()
    public username: string

    @IsString()
    @MinLength(8)
    public password: string

    @IsEnum(ROLES)
    public role: Role

    public constructor(input: CreateUserDTO = {} as CreateUserDTO) {
        this.username = input.username
        this.password = input.password
        this.role = input.role
    }
}
