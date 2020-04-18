import Model from "./Model";

class RoomModel extends Model {
  constructor() {
    super("rooms");
  }

  public async getAll() {
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

    return allRooms;
  }
}

export default RoomModel;
