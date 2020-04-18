import mongodb from "mongodb";
const { ObjectID } = mongodb;
import { ObjectID as ObjectIDType } from "mongodb";
import Model from "./Model";

class RoomModel extends Model {
  constructor() {
    super("rooms");
  }

  public async getAllByUser(userId: string) {
    const collection = await this.getCollection();
    const allRooms = await collection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "memberInfo",
          },
        },
      ])
      .toArray();

    const userObjectId = new ObjectID(userId);
    const filteredRooms = allRooms.filter((room) => {
      let hasMatch = false;
      room.members.forEach((member: ObjectIDType) => {
        if (member.equals(userObjectId)) {
          hasMatch = true;
        }
      });
      return hasMatch;
    });

    return filteredRooms;
  }

  public async addMessage(roomId: string, messageId: string) {
    const collection = await this.getCollection();
    await collection.updateOne(
      {
        _id: new ObjectID(roomId),
      },
      {
        $push: { messages: messageId },
      }
    );
  }
}

export default RoomModel;
