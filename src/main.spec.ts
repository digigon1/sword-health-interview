jest.mock("@nestjs/core", () => ({
    NestFactory: {
        create: () =>
            Promise.resolve({
                useGlobalPipes: jest.fn(),
                listen: jest.fn(),
            }),
    },
}))

describe("Main", () => {
    it("starts", () => {
        require("./main")
    })
})
