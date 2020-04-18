import mongodb from "mongodb";
const { ObjectID } = mongodb;
import Model from "./Model";

class MessageModel extends Model {
  constructor() {
    super("messages");
  }

  public async getAllByRoom(roomId: string) {
    const collection = await this.getCollection();
    const messages = await collection
      .find({ room: new ObjectID(roomId) })
      .toArray();

    return messages;
  }
}

export default MessageModel;
