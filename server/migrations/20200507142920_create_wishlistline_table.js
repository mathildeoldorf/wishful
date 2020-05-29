exports.up = function (knex) {
    return knex.schema
        .createTable("WishlistLine", (table) => {
            table.increments("ID").primary().unsigned().notNullable();
            table.string("title", 255);
            table.text("description");
            table.string("price");
            table.text("link");
            table.text("image");
            table.boolean("isActive").defaultTo("1");
            table.integer("wishlistID").unsigned().notNullable();
            table.foreign("wishlistID").references("Wishlist.ID");
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("WishlistLine");
};