const dotenv = require("dotenv")
const amqp = require("amqplib")

async function bootstrap() {
    // Load env vars
    dotenv.config()

    const queueConnection = await amqp.connect({
        hostname: process.env.AMQP_HOST,
        username: process.env.AMQP_USERNAME,
        password: process.env.AMQP_PASSWORD,
    })

    const ch = await queueConnection.createChannel()
    
    await ch.assertQueue(process.env.TASK_QUEUE)

    ch.consume(process.env.TASK_QUEUE, msg => console.log(msg.content.toString()))
}
bootstrap()
