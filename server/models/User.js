const { ObjectID } = require("mongodb");
const DBClient = require("./DBClient");

module.exports = class UserModel {
  constructor() {
    this.db = DBClient.getInstance();
  }

  async getCollection() {
    return this.db.getCollection("users");
  }

  async getById(id) {
    const collection = await this.getCollection();
    const user = await collection.findOne({
      _id: ObjectID(id),
    });

    if (!user) {
      throw new Error("No user found");
    }
    return user;
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
