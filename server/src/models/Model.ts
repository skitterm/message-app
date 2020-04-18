import mongodb from "mongodb";
const { ObjectID } = mongodb;
import DBClient from "./DBClient";

class Model {
  private collectionName: string;
  private db: DBClient;

  constructor(collectionName) {
    this.collectionName = collectionName;
    this.db = DBClient.getInstance();
  }

  public async getCollection() {
    return this.db.getCollection(this.collectionName);
  }

  public async getById(id) {
    const collection = await this.getCollection();
    const item = await collection.findOne({
      _id: new ObjectID(id),
    });

    if (!item) {
      throw new Error("No item found");
    }
    return item;
  }
}

export default Model;
