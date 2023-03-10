import { IsString } from "class-validator"

export enum Role {
    Manager = "MANAGER",
    Technician = "TECHNICIAN",
}

export class LoginDto {
    @IsString()
    public username: string

    @IsString()
    public password: string

    public constructor(input: LoginDto = {} as LoginDto) {
        // Default arg for NestJS ValidationPipe
        this.username = input.username

        this.password = input.password
    }
}
