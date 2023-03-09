import { Injectable } from "@nestjs/common"
import { Task } from "../modules/task/task.models"
import * as amqp from "amqplib"
import { User } from "../modules/user/user.models"

enum ChannelTypes {
    SEND_TASK_COMPLETE = "SEND_TASK_COMPLETE",
}

@Injectable()
export class NotificationService {
    private queueConnection: Promise<amqp.Connection>
    private channels: { [key: string]: amqp.Channel }

    constructor() {
        // Init client
        this.queueConnection = amqp.connect({
            hostname: process.env.AMQP_HOST,
            username: process.env.AMQP_USERNAME,
            password: process.env.AMQP_PASSWORD,
        })

        // Init channel cache
        this.channels = {}
    }

    public async sendTaskCompleteNotification(user: User, task: Task) {
        // Check if we have a channel cached...
        if (!this.channels[ChannelTypes.SEND_TASK_COMPLETE]) {  // ...if we don't, create one and store it
            // Await connection
            const conn = await this.queueConnection

            // Create new channel
            let ch = await conn.createChannel()

            // Checks queue exist + create it if not
            await ch.assertQueue(process.env.TASK_QUEUE)

            // Store in cache
            this.channels[ChannelTypes.SEND_TASK_COMPLETE] = ch
        }

        // Gets cached channel
        let channel: amqp.Channel =
            this.channels[ChannelTypes.SEND_TASK_COMPLETE]

        // Create message to send, can be anything in buffer
        const buf = Buffer.from(
            `The tech ${user.username} performed the task ${
                task.summary
            } on date ${task.performedAt.toISOString()}`,
        )

        // Sends message
        channel.sendToQueue(process.env.TASK_QUEUE, buf)
    }
}
