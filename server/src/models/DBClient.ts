import mongodb, { MongoClient as MongoClientType, Collection } from "mongodb";
const { MongoClient } = mongodb;

class DBClient {
  private static instance: DBClient;

  public static getInstance(): DBClient {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }

  private client: MongoClientType;

  constructor() {
    this.client = new MongoClient(process.env.DB_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public async getCollection(collection: string): Promise<Collection> {
    await this.connect();
    const db = this.client.db("messageApp");
    return db.collection(collection);
  }

  private async connect(): Promise<void> {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
  }
}

export default DBClient;
