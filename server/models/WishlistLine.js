const { Model } = require("objection");

class WishlistLine extends Model {
  static get tableName() {
    return "WishlistLine";
  }
  static get idColumn() {
    return "ID";
  }
}
module.exports = WishlistLine;
