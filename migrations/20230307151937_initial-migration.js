/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.up = async function (knex) {
    // Create users table
    await knex.schema.createTable("users", async table => {
        table.increments("id").primary()  // Primary key
        table.string("username").notNullable().unique()  // We can't have duplicated usernames
        table.string("password").notNullable()
        table.enum("role", ["MANAGER", "TECHNICIAN"]).defaultTo("TECHNICIAN")  // Default value
    })

    // Create tasks table
    await knex.schema.createTable("tasks", async table => {
        table.increments("id").primary()  // Primary key
        table.integer("userId").unsigned().notNullable()  // Foreign key
        table.string("summary", 2500).notNullable().defaultTo("")  // Max size 2500
        table.date("performedAt").nullable()

        table.foreign("userId").references("id").inTable("users")  // Foreign key constraint
    })
}

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = async function(knex) {
    // Drop new tables
    await knex.schema.dropTable("tasks")
    await knex.schema.dropTable("users")
}
