import mongodb from "mongodb";
const { ObjectID } = mongodb;
import Model from "./Model";

class UserModel extends Model {
  constructor() {
    super("users");
  }

  public async getById(id: string) {
    const collection = await this.getCollection();
    const item = await collection.findOne({
      _id: id,
    });

    return item;
  }

  public async addItem(id: string, firstName: string, lastName: string) {
    const collection = await this.getCollection();
    const result = await collection.insertOne({
      _id: id,
      name: {
        first: firstName,
        last: lastName,
      },
      timeZone: "(UTC-07:00) Pacific Time (US & Canada)",
      thumbnail: "bc=#F9A37D;st=cr,sbc=#2D4CFC,sds=37%,ssx=26%,ssy=42%,or=h",
      workingHours: [],
      rooms: [],
      unreadMessages: [],
    });

    return result.insertedId;
  }

  public async updateById(
    id: string,
    firstName: string,
    lastName: string,
    timeZone: string,
    thumbnail: string
  ): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      {
        _id: new ObjectID(id),
      },
      {
        $set: {
          "name.first": firstName,
          "name.last": lastName,
          timeZone,
          thumbnail,
        },
      }
    );
  }

  public async getAll() {
    const collection = await this.getCollection();
    const allUsers = await collection.find({}).toArray();

    return allUsers;
  }
}

export default UserModel;
