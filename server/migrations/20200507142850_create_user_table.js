exports.up = function (knex) {
    return knex.schema
        .createTable("User", (table) => {
            table.increments("ID").primary().unsigned().notNullable();
            table.string("firstName").notNullable();
            table.string("lastName").notNullable();
            table.string("email").notNullable().unique();
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.string("password").notNullable();
            table.boolean("isActive").notNullable().defaultTo("1");
            table.string("token");
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("User");
};