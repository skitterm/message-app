const { ObjectID } = require("mongodb");

module.exports = class MessageModel {
  constructor(collection) {
    this.collection = collection;
  }

  async getAllByRoom(roomId) {
    const messages = await this.collection
      .find({ room: ObjectID(roomId) })
      .toArray();

    return messages;
  }
};
