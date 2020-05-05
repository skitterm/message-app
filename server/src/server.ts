import express from "express";
// @ts-ignore
import googleAuthLibrary from "google-auth-library";
const { OAuth2Client } = googleAuthLibrary;
// @ts-ignore
import dotenv from "dotenv";
import UserModel from "./models/User";
import RoomModel from "./models/Room";
import MessageModel from "./models/Message";
import Socket from "./socket";

dotenv.config({ path: "../.env" });

const GOOGLE_CLIENT_ID = "239598225082-2ehdvkfbu6l3oc4aekt5pqrs7nlt0c4h";

const socket = new Socket();
socket.init();
const authClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());
(async function () {
  app.listen(3001, () => {
    const userModel = new UserModel();
    const roomModel = new RoomModel();
    const messageModel = new MessageModel();

    console.log("app up and running");
    app.get("/users/:id/rooms", async (req, res) => {
      try {
        const rooms = await roomModel.getAllByUser(req.params.id);
        res.send(rooms);
      } catch (error) {
        console.log(error);
        res
          .status(404)
          .send({ message: "Unable to find rooms for user with that ID" });
      }
    });

    app.post("/users/:id/rooms", async (req, res) => {
      const { userId, memberId } = req.body;
      const user = await userModel.getById(userId);
      let roomId = req.body.roomId;
      if (!roomId) {
        // create a room
        roomId = await roomModel.addItem([userId, memberId]);
      }
      const room = await roomModel.getById(roomId);
      if (room) {
        // add that room to this user's rooms
        await userModel.addRoom(userId, roomId);
        // add room to the other user's rooms
        await userModel.addRoom(memberId, roomId);
      }

      res.send();
    });

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
        console.error(error);
      }
    });

    app.get("/users", async (req, res) => {
      try {
        const users = await userModel.getAll();

        res.send(users);
      } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Unable to retrieve users" });
      }
    });

    app.put("/users", async (req, res) => {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const userId = req.body.id;

      const user = userModel.getById(req.body.id);
      // if user doesn't already exist, create a new user.

      if (!user) {
        userModel.addItem(userId, firstName, lastName);
      }

      res.send();
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

    app.post("/messages", async (req, res) => {
      const addedMessageId = await messageModel.addItem(
        req.body.sender as string,
        req.body.roomId as string,
        req.body.contents as string,
        req.body.timeSent as number
      );

      // add to rooms as well
      await roomModel.addMessage(req.body.roomId, addedMessageId);

      res.send();
    });

    app.post("/token", async (req, res) => {
      try {
        const ticket = await authClient.verifyIdToken({
          idToken: req.body.idToken,
        });
        const payload = ticket.getPayload();

        const user = await userModel.getById(payload.sub);
        console.log("user: ", user);

        res.send({
          id: payload.sub,
          exists: !!user,
          firstName: payload.given_name,
          lastName: payload.family_name,
        });
      } catch (error) {
        console.error("ze error: ", error);
        res.send();
      }
    });
  });
})();
