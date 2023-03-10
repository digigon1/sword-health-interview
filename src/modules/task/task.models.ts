import { IsDate, IsInt, IsOptional, IsString, Length } from "class-validator"

export class Task {
    @IsInt()
    public id: number

    @IsInt()
    public userId: number

    @IsString()
    @Length(0, 2500) // Checks for task max length
    public summary: string

    @IsOptional()
    @IsDate()
    public performedAt?: Date

    public constructor(input: Task) {
        this.id = input.id

        this.userId = input.userId

        this.summary = input.summary

        if (input.performedAt) {
            this.performedAt = input.performedAt
        }
    }
}

export class CreateTaskDTO {
    @IsString()
    @Length(0, 2500) // Checks for task max length
    public summary: Task["summary"]

    public constructor(input: CreateTaskDTO = {} as CreateTaskDTO) {
        this.summary = input.summary
    }
}

export class UpdateTaskDTO {
    @IsString()
    @Length(0, 2500) // Checks for task max length
    public summary: Task["summary"]

    public constructor(input: UpdateTaskDTO = {} as UpdateTaskDTO) {
        this.summary = input.summary
    }
}
