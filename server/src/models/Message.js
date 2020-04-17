const { ObjectID } = require("mongodb");
const Model = require("./Model");

module.exports = class MessageModel extends Model {
  constructor() {
    super("messages");
  }

  async getAllByRoom(roomId) {
    const collection = await this.getCollection();
    const messages = await collection
      .find({ room: ObjectID(roomId) })
      .toArray();

    return messages;
  }
};
