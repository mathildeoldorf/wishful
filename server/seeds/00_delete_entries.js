exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("WishlistLine").del()
    .then(() => {
      return knex("Wishlist").del();
    })
    .then(() => {
      return knex("User").del();
    });
};