exports.seed = async function (knex) {
  const userIDs = await knex.select("ID").from("User");
  userIDs.sort(function (a, b) {
    return a.ID - b.ID;
  });
  return knex("Wishlist").insert([{
      name: "Birthday wishes",
      description: "Wishes for my birthday",
      userID: userIDs[0].ID,
    },
    {
      name: "Housewarming wishes",
      description: "My current interior obsessions",
      userID: userIDs[1].ID,
    },
    {
      name: "Need to have",
      description: "The things I really need",
      userID: userIDs[2].ID,
    },
  ]);
};