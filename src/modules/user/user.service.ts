import { Injectable } from "@nestjs/common"
import { DatabaseService, Table } from "../../providers/database"
import { CreateUserDTO, User } from "./user.models"
import * as bcrypt from "bcrypt"
import { NotFoundError } from "../../errors"

@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService) {}

    public async get(id: number): Promise<User> {
        // Get user based on id
        const result = await this.databaseService.select(Table.Users, { id })

        // If no user is found...
        if (result.length === 0) {
            // ...throw error
            throw new NotFoundError()
        }

        return result[0]
    }

    public async create(user: CreateUserDTO): Promise<User> {
        // Get rounds from env
        const saltRounds = +process.env.SALT_ROUNDS

        // Hash password
        const hash = await bcrypt.hash(user.password, saltRounds)

        // Store user in DB
        const id = await this.databaseService.insert(Table.Users, {
            ...user,
            password: hash,
        })

        // Get user, without password
        const { password, ...result } = await this.get(id)

        return result
    }

    public async getByUsername(username: string): Promise<User> {
        // Get user based on username
        const result = await this.databaseService.select(Table.Users, {
            username,
        })

        // If no user is found...
        if (result.length === 0) {
            // ...throw error
            throw new NotFoundError()
        }

        return result[0]
    }
}
