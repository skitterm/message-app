const { ObjectID } = require("mongodb");

module.exports = class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  async getById(id) {
    const user = await this.collection.findOne({
      _id: ObjectID(id),
    });

    if (!user) {
      throw new Error("No user found");
    }
    return user;
  }

  async updateName(id, firstName, lastName) {
    await this.collection.updateOne(
      {
        _id: ObjectID(id),
      },
      {
        $set: { "name.first": firstName, "name.last": lastName },
      }
    );
  }
};
