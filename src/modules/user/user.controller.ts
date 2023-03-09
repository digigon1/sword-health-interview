import { Body, Controller, Post } from "@nestjs/common"
import { CreateUserDTO, User } from "./user.models"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    // No security to help with usage, ideally this would
    //  be restricted to managers or something similar
    @Post("/")
    public async createUser(@Body() input: CreateUserDTO): Promise<User> {
        return this.userService.create(input)
    }
}
