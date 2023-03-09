import { Injectable } from "@nestjs/common"
import * as knex from "knex"
import { User } from "../modules/user/user.models"
import { Task } from "../modules/task/task.models"

export enum Table {
    Tasks = "tasks",
    Users = "users",
}

// Return type based on table name
type Type<T extends Table> = T extends Table.Tasks
    ? Task
    : T extends Table.Users
    ? User
    : never

// Return primary key based on table name
type PK<T extends Table> = T extends Table.Tasks
    ? "id"
    : T extends Table.Users
    ? "id"
    : never

// Return type without primary key for insert
export type Insert<T extends Table> = Omit<Type<T>, PK<T>>

@Injectable()
export class DatabaseService {
    private knex: knex.Knex

    constructor() {
        // Init knex client
        this.knex = knex.knex({
            client: "mysql2",
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            },
        })
    }

    public async insert<T extends Table>(
        table: T,
        value: Insert<T>,
    ): Promise<Type<T>[PK<T>]> {
        // Insert value in table
        return (await this.knex.table(table).insert(value))[0]
    }

    public async select<T extends Table>(
        table: T,
        where?: Partial<Type<T>>,
    ): Promise<Type<T>[]> {
        // Get values from table
        let query = this.knex.table(table).select("*")
        if (where) {
            // Use filter if exists
            query = query.where(where)
        }
        return query
    }

    public async update<T extends Table>(
        table: T,
        set: Partial<Type<T>>,
        where?: Partial<Type<T>>,
    ): Promise<void> {
        // Update values in table
        let query = this.knex.table(table).update(set)
        if (where) {
            // Use filter if exists
            query = query.where(where)
        }
        return query as any
    }

    public async delete<T extends Table>(
        table: T,
        where?: Partial<Type<T>>,
    ): Promise<void> {
        // Delete values in table
        let query = this.knex.table(table).delete()
        if (where) {
            // Use filter if exists
            query = query.where(where)
        }
        return query as any
    }
}
