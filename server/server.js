const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config({ path: "../.env" });
const UserModel = require("./models/User");
const RoomModel = require("./models/rooms");
const MessageModel = require("./models/messages");

const app = express();
(async function () {
  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("messageApp");

  app.listen(3001, () => {
    const userModel = new UserModel();
    const roomModel = new RoomModel(db.collection("rooms"));
    const messageModel = new MessageModel(db.collection("messages"));

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

    app.post("/users/:id", async (req, res) => {
      try {
        await userModel.updateName(
          req.params.id,
          req.query.firstName,
          req.query.lastName
        );
        res.send();
      } catch (error) {
        //
      }
    });

    app.get("/rooms", async (req, res) => {
      const roomsAugmented = await roomModel.getAll();
      res.send(roomsAugmented);
    });

    app.get("/rooms/:id/messages", async (req, res) => {
      const messages = await messageModel.getAllByRoom(req.params.id);

      const augmentedItems = await Promise.all(
        messages.map(async (message) => {
          const user = await userModel.getById(message.sender);
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
