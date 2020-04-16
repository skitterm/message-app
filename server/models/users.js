const { ObjectID } = require("mongodb");

module.exports = class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  async getUserById(id) {
    const user = await this.collection.findOne({
      _id: ObjectID(id),
    });

    if (!user) {
      throw new Error("No user found");
    }
    return user;
  }
};
