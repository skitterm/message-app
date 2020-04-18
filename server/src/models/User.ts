import mongodb from "mongodb";
const { ObjectID } = mongodb;
import Model from "./Model";

class UserModel extends Model {
  constructor() {
    super("users");
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
