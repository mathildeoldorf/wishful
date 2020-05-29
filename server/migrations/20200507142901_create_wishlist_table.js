exports.up = function (knex) {
    return knex.schema
        .createTable("Wishlist", (table) => {
            table.increments("ID").primary().unsigned().notNullable();
            table.string("name");
            table.string("description");
            table.boolean("isActive").defaultTo(1);
            table.boolean("isPublic").defaultTo(1).notNullable();
            table.integer("userID").unsigned().notNullable();
            table.foreign("userID").references("User.ID");
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("WishList");
};