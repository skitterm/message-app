const { ObjectID } = require("mongodb");
const DBClient = require("./DBClient");

module.exports = class Model {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.db = DBClient.getInstance();
  }

  async getCollection() {
    return this.db.getCollection(this.collectionName);
  }

  async getById(id) {
    const collection = await this.getCollection();
    const item = await collection.findOne({
      _id: ObjectID(id),
    });

    if (!item) {
      throw new Error("No item found");
    }
    return item;
  }
};
