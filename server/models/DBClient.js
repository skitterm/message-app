const { MongoClient } = require("mongodb");

module.exports = class DBClient {
  constructor() {
    this.client = new MongoClient(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async connect() {
    await this.client.connect();
  }

  async getCollection(collection) {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
    const db = this.client.db("messageApp");
    return db.collection(collection);
  }

  static instance;

  static getInstance() {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }
};
