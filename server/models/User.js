const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "User";
  }
  static get idColumn() {
    return "ID";
  }
}

module.exports = User;
