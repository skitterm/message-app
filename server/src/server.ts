import express from "express";
// @ts-ignore
import dotenv from "dotenv";
import UserModel from "./models/User";
import RoomModel from "./models/Room";
import MessageModel from "./models/Message";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
(async function () {
  app.listen(3001, () => {
    const userModel = new UserModel();
    const roomModel = new RoomModel();
    const messageModel = new MessageModel();

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

    app.put("/users/:id", async (req, res) => {
      try {
        await userModel.updateById(
          req.params.id,
          req.body.firstName as string,
          req.body.lastName as string,
          req.body.timeZone as string,
          req.body.thumbnail as string
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
