module.exports = class RoomModel {
  constructor(collection) {
    this.collection = collection;
  }

  async getAll() {
    const allRooms = await this.collection
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
