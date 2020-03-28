const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config({ path: "../.env" });

const app = express();
(async function() {
  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  const db = client.db("messageApp");

  app.listen(3001, () => {
    console.log("app up and running");

    app.get("/messages", async (req, res) => {
      const messagesCollection = db.collection("messages");
      const messages = await messagesCollection.find({}).toArray();
      const augmentedItems = await Promise.all(
        messages.map(async message => {
          const usersCollection = db.collection("users");
          const user = await usersCollection.findOne({ _id: message.sender });
          return {
            message,
            user
          };
        })
      );

      res.send(augmentedItems);
    });
  });
})();
