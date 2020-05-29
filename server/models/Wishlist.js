const { Model } = require("objection");

class Wishlist extends Model {
  static get tableName() {
    return "Wishlist";
  }
  static get idColumn() {
    return "ID";
  }
}
module.exports = Wishlist;
