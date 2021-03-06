import mongodb, { ObjectId } from "mongodb";
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

  public async addItem(
    senderId: string,
    roomId: string,
    contents: string,
    timeSent: number
  ) {
    const collection = await this.getCollection();
    const result = await collection.insertOne({
      sender: senderId,
      timeSent,
      contents,
      room: new ObjectID(roomId),
    });

    return result.insertedId;
  }
}

export default MessageModel;
