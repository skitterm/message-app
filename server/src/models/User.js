const { ObjectID } = require("mongodb");
const DBClient = require("./DBClient");
const Model = require("./Model");

module.exports = class UserModel extends Model {
  constructor() {
    super("users");
  }

  async updateName(id, firstName, lastName) {
    const collection = await this.getCollection();
    await collection.updateOne(
      {
        _id: ObjectID(id),
      },
      {
        $set: { "name.first": firstName, "name.last": lastName },
      }
    );
  }
};
