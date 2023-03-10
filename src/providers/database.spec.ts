import { Role } from "../modules/auth/auth.models"
import { User } from "../modules/user/user.models"
import { DatabaseService, Table } from "./database"

const knex = {
    table: jest.fn(() => knex),
    insert: jest.fn(() => knex),
    select: jest.fn(() => knex),
    where: jest.fn(() => knex),
    update: jest.fn(() => knex),
    delete: jest.fn(() => knex),
}
jest.mock("knex", () => ({
    knex: () => knex,
}))

describe("Providers > Database", () => {
    describe("DatabaseService", () => {
        it("creates", () => {
            const service = new DatabaseService()
            expect(service).toBeInstanceOf(DatabaseService)
        })

        describe("insert", () => {
            // Happy
            it("inserts new value", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const service = new DatabaseService()
                knex.insert.mockResolvedValueOnce([mockUser.id])
                const result = await service.insert(Table.Users, mockUser)

                expect(result).toBe(mockUser.id)
                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.insert).toBeCalledWith(mockUser)
            })
        })

        describe("select", () => {
            // Happy
            it("selects without where", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const service = new DatabaseService()
                knex.select.mockResolvedValueOnce([mockUser])

                const result = await service.select(Table.Users)

                expect(result).toEqual([mockUser])
                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.select).toBeCalledWith("*")
            })

            it("selects with where", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const service = new DatabaseService()
                knex.where.mockResolvedValueOnce([mockUser])
                const where = { id: 1 }

                const result = await service.select(Table.Users, where)

                expect(result).toEqual([mockUser])
                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.select).toBeCalledWith("*")
                expect(knex.where).toBeCalledWith(where)
            })
        })

        describe("update", () => {
            // Happy
            it("updates without where", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const service = new DatabaseService()
                knex.update.mockResolvedValueOnce([mockUser])

                await service.update(Table.Users, mockUser)

                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.update).toBeCalledWith(mockUser)
            })

            it("updates with where", async () => {
                // Setup
                const mockUser = new User({
                    id: 1,
                    username: "username",
                    role: Role.Manager,
                })
                const service = new DatabaseService()
                knex.where.mockResolvedValueOnce([mockUser])
                const where = { id: 1 }

                await service.update(Table.Users, mockUser, where)

                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.update).toBeCalledWith(mockUser)
                expect(knex.where).toBeCalledWith(where)
            })
        })

        describe("delete", () => {
            // Happy
            it("deletes without where", async () => {
                // Setup
                const service = new DatabaseService()

                await service.delete(Table.Users)

                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.delete).toBeCalledWith()
            })

            it("deletes with where", async () => {
                // Setup
                const service = new DatabaseService()
                const where = { id: 1 }

                await service.delete(Table.Users, where)

                expect(knex.table).toBeCalledWith(Table.Users)
                expect(knex.delete).toBeCalledWith()
                expect(knex.where).toBeCalledWith(where)
            })
        })
    })
})
