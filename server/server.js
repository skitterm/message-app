const { MongoClient, ObjectID } = require("mongodb");
const express = require("express");
require("dotenv").config({ path: "../.env" });
const UserModel = require("./models/users");
const RoomModel = require("./models/rooms");

const app = express();
(async function () {
  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("messageApp");

  app.listen(3001, () => {
    const userModel = new UserModel(db.collection("users"));
    const roomModel = new RoomModel(db.collection("rooms"));

    console.log("app up and running");
    app.get("/users/:id", async (req, res) => {
      try {
        const user = await userModel.getById(req.params.id);

        res.send(user);
      } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Unable to find a user with that ID" });
      }
    });

    app.get("/rooms", async (req, res) => {
      const roomsAugmented = await roomModel.getAll();
      res.send(roomsAugmented);
    });

    app.get("/rooms/:id/messages", async (req, res) => {
      const messagesCollection = db.collection("messages");
      const messages = await messagesCollection
        .find({ room: ObjectID(req.params.id) })
        .toArray();

      const augmentedItems = await Promise.all(
        messages.map(async (message) => {
          const usersCollection = db.collection("users");
          const user = await usersCollection.findOne({ _id: message.sender });
          return {
            message,
            user,
          };
        })
      );

      res.send(augmentedItems);
    });
  });
})();
