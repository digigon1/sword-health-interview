import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "./../src/app.module"
import { Role } from "../src/modules/auth/auth.models"
import * as knex from "knex"

describe("AppController (e2e)", () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init()
    })

    it("tests the whole flow", async () => {
        const managerUserDetails: any = {
            username: "manager",
            password: "password",
            role: Role.Manager,
        }
        const tech1UserDetails: any = {
            username: "tech1",
            password: "password",
            role: Role.Technician,
        }
        const tech2UserDetails: any = {
            username: "tech2",
            password: "password",
            role: Role.Technician,
        }

        // Fails for pw under 8 chars
        expect(
            (
                await request(app.getHttpServer()).post("/user").send({
                    username: "user",
                    password: "",
                    role: Role.Technician,
                })
            ).statusCode,
        ).toBe(400)

        // Fails for invalid role
        expect(
            (
                await request(app.getHttpServer())
                    .post("/user")
                    .send({ username: "user", password: "password", role: "" })
            ).statusCode,
        ).toBe(400)

        // Create manager user
        const createManagerUserResponse: {
            id: number
            username: string
            role: string
        } = (
            await request(app.getHttpServer())
                .post("/user")
                .send(managerUserDetails)
        ).body

        expect(createManagerUserResponse.username).toEqual(
            managerUserDetails.username,
        )
        expect(createManagerUserResponse.role).toEqual(managerUserDetails.role)
        managerUserDetails.id = createManagerUserResponse.id

        // Create technician 1 user
        const createTech1UserResponse: {
            id: number
            username: string
            role: string
        } = (
            await request(app.getHttpServer())
                .post("/user")
                .send(tech1UserDetails)
        ).body

        expect(createTech1UserResponse.username).toEqual(
            tech1UserDetails.username,
        )
        expect(createTech1UserResponse.role).toEqual(tech1UserDetails.role)
        tech1UserDetails.id = createTech1UserResponse.id

        // Create technician 2 user
        const createTech2UserResponse: {
            id: number
            username: string
            role: string
        } = (
            await request(app.getHttpServer())
                .post("/user")
                .send(tech2UserDetails)
        ).body

        expect(createTech2UserResponse.username).toEqual(
            tech2UserDetails.username,
        )
        expect(createTech2UserResponse.role).toEqual(tech2UserDetails.role)
        tech2UserDetails.id = createTech2UserResponse.id

        // Fails login with wrong pw
        expect(
            (
                await request(app.getHttpServer())
                    .post("/auth/login")
                    .send({ username: "tech1", password: "" })
            ).statusCode,
        ).toBe(401)

        // Login all users
        managerUserDetails.access_token = (
            await request(app.getHttpServer())
                .post("/auth/login")
                .send(managerUserDetails)
        ).body.access_token

        tech1UserDetails.access_token = (
            await request(app.getHttpServer())
                .post("/auth/login")
                .send(tech1UserDetails)
        ).body.access_token

        tech2UserDetails.access_token = (
            await request(app.getHttpServer())
                .post("/auth/login")
                .send(tech2UserDetails)
        ).body.access_token

        // Create tasks
        const mockTask1: any = {
            userId: tech1UserDetails.id,
            summary: "Mock Task 1",
            performedAt: null,
        }
        const mockTask2: any = {
            userId: managerUserDetails.id,
            summary: "Mock Task 2",
            performedAt: null,
        }

        mockTask1.id = (
            await request(app.getHttpServer())
                .post("/task")
                .auth(tech1UserDetails.access_token, { type: "bearer" })
                .send({
                    summary: mockTask1.summary,
                })
        ).body.id

        mockTask2.id = (
            await request(app.getHttpServer())
                .post("/task")
                .auth(managerUserDetails.access_token, { type: "bearer" })
                .send({
                    summary: mockTask2.summary,
                })
        ).body.id

        // Fail if summary is too long
        expect(
            (
                await request(app.getHttpServer())
                    .post("/task")
                    .auth(managerUserDetails.access_token, { type: "bearer" })
                    .send({
                        summary: "a".repeat(2501),
                    })
            ).statusCode,
        ).toBe(400)

        // Get tasks
        let managerTaskList = (
            await request(app.getHttpServer())
                .get("/task")
                .auth(managerUserDetails.access_token, { type: "bearer" })
                .send()
        ).body

        let tech1TaskList = (
            await request(app.getHttpServer())
                .get("/task")
                .auth(tech1UserDetails.access_token, { type: "bearer" })
                .send()
        ).body

        let tech2TaskList = (
            await request(app.getHttpServer())
                .get("/task")
                .auth(tech2UserDetails.access_token, { type: "bearer" })
                .send()
        ).body

        expect(managerTaskList).toHaveLength(2)
        expect(tech1TaskList).toHaveLength(1)
        expect(tech1TaskList[0]).toEqual(mockTask1)
        expect(tech2TaskList).toHaveLength(0)

        // Fail to change summary if task does not exist
        expect(
            (
                await request(app.getHttpServer())
                    .patch(`/task/0/summary`)
                    .auth(tech1UserDetails.access_token, { type: "bearer" })
                    .send({
                        summary: "New task 1 summary",
                    })
            ).statusCode,
        ).toBe(404)

        // Fail to change summary if user does not have permission
        expect(
            (
                await request(app.getHttpServer())
                    .patch(`/task/${mockTask1.id}/summary`)
                    .auth(tech2UserDetails.access_token, { type: "bearer" })
                    .send({
                        summary: "New task 1 summary",
                    })
            ).statusCode,
        ).toBe(403)

        // Fail to change summary if summary is too long
        expect(
            (
                await request(app.getHttpServer())
                    .patch(`/task/${mockTask1.id}/summary`)
                    .auth(tech2UserDetails.access_token, { type: "bearer" })
                    .send({
                        summary: "a".repeat(2501),
                    })
            ).statusCode,
        ).toBe(400)

        // Change task 1 summary
        const updatedSummaryTask1 = (
            await request(app.getHttpServer())
                .patch(`/task/${mockTask1.id}/summary`)
                .auth(tech1UserDetails.access_token, { type: "bearer" })
                .send({
                    summary: "New task 1 summary",
                })
        ).body
        expect(updatedSummaryTask1).toEqual({
            ...mockTask1,
            summary: "New task 1 summary",
        })
        mockTask1.summary = updatedSummaryTask1.summary

        // Fail if task does not exist
        expect(
            (
                await request(app.getHttpServer())
                    .post(`/task/0/complete`)
                    .auth(managerUserDetails.access_token, { type: "bearer" })
                    .send()
            ).statusCode,
        ).toBe(404)

        // Fail if user does not have permission
        expect(
            (
                await request(app.getHttpServer())
                    .post(`/task/${mockTask2.id}/complete`)
                    .auth(tech1UserDetails.access_token, { type: "bearer" })
                    .send()
            ).statusCode,
        ).toBe(403)

        // Complete task 2
        const completeTask2 = (
            await request(app.getHttpServer())
                .post(`/task/${mockTask2.id}/complete`)
                .auth(managerUserDetails.access_token, { type: "bearer" })
                .send()
        ).body
        const todayAtMidnight = new Date()
        todayAtMidnight.setHours(0, 0, 0, 0)
        expect(new Date(completeTask2.performedAt).getTime()).toBeCloseTo(
            todayAtMidnight.getTime(),
        )
        mockTask2.performedAt = completeTask2.performedAt

        // Fail if task is already complete
        expect(
            (
                await request(app.getHttpServer())
                    .post(`/task/${mockTask2.id}/complete`)
                    .auth(managerUserDetails.access_token, { type: "bearer" })
                    .send()
            ).statusCode,
        ).toBe(409)

        // Fail if user is not manager
        expect(
            (
                await request(app.getHttpServer())
                    .delete(`/task/${mockTask1.id}`)
                    .auth(tech1UserDetails.access_token, { type: "bearer" })
                    .send()
            ).statusCode,
        ).toBe(403)

        // Delete task 1
        await request(app.getHttpServer())
            .delete(`/task/${mockTask1.id}`)
            .auth(managerUserDetails.access_token, { type: "bearer" })
            .send()

        // Get tasks after delete
        managerTaskList = (
            await request(app.getHttpServer())
                .get("/task")
                .auth(managerUserDetails.access_token, { type: "bearer" })
                .send()
        ).body

        tech1TaskList = (
            await request(app.getHttpServer())
                .get("/task")
                .auth(tech1UserDetails.access_token, { type: "bearer" })
                .send()
        ).body

        tech2TaskList = (
            await request(app.getHttpServer())
                .get("/task")
                .auth(tech2UserDetails.access_token, { type: "bearer" })
                .send()
        ).body

        expect(managerTaskList).toHaveLength(1)
        expect(managerTaskList[0]).toEqual(mockTask2)
        expect(tech1TaskList).toHaveLength(0)
        expect(tech2TaskList).toHaveLength(0)
    })

    afterEach(async () => {
        const db = knex.knex({
            client: "mysql2",
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            },
        })

        await db.table("tasks").del()
        await db.table("users").del()

        await app.close()
    })
})
