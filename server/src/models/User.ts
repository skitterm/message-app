import mongodb from "mongodb";
const { ObjectID } = mongodb;
import Model from "./Model";

class UserModel extends Model {
  constructor() {
    super("users");
  }

  public async updateName(
    id: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      {
        _id: new ObjectID(id),
      },
      {
        $set: { "name.first": firstName, "name.last": lastName },
      }
    );
  }
}

export default UserModel;
