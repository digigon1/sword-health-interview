import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
    // Create app
    const app = await NestFactory.create(AppModule)

    // Add validation based on class-validator
    app.useGlobalPipes(new ValidationPipe())

    // Listen on port 3000
    await app.listen(3000)
}
bootstrap()
