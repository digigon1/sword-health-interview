const dotenv = require("dotenv")
// Update with your config settings.

/**
* @type { Object.<string, import("knex").Knex.Config> }
*/
dotenv.config()

config = {
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }
}
module.exports = {
    development: config,
    staging: config,
    production: config,
}
