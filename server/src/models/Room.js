const Model = require("./Model");

module.exports = class RoomModel extends Model {
  constructor() {
    super("rooms");
  }

  async getAll() {
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
};