import express from "express";

import mongodb, { ObjectID, Collection } from "mongodb";
const { MongoClient } = mongodb;
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
      const userId = req.params.id;
      const memberId = req.body.memberId;
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

        if (!user) {
          throw new Error("No user found");
        }

        res.send(user);
      } catch (error) {
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
      try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userId = req.body.id;

        const user = await userModel.getById(req.body.id);
        // if user doesn't already exist, create a new user.
        if (!user) {
          await userModel.addItem(userId, firstName, lastName);
        }

        res.send();
      } catch (error) {
        console.error("error in PUT /users: ", error);
        res.status(500).send();
      }
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
      const ticket = await authClient.verifyIdToken({
        idToken: req.body.idToken,
      });
      const payload = ticket.getPayload();

      const user = await userModel.getById(payload.sub);

      res.send({
        id: payload.sub,
        exists: !!user,
        firstName: payload.given_name,
        lastName: payload.family_name,
      });
    });

    app.get("/demo", async (request, response) => {
      const runTheDB = async () => {
        const client = new MongoClient(process.env.DB_URL as string, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        await client.connect();
        const db = client.db("messageApp");

        const messagesCollection = db.collection("messages");
        const roomsCollection = db.collection("rooms");
        const usersCollection = db.collection("users");

        await messagesCollection.deleteMany({});
        await roomsCollection.deleteMany({});
        await usersCollection.deleteMany({});

        const userItems = [
          {
            name: {
              first: "Bob",
              last: "Johnson",
            },
            timeZone: "(UTC-07:00) Pacific Time (US & Canada)",
            thumbnail:
              "bc=#CBF13C;st=sq,sbc=#D061B2,sds=56%,ssx=66%,ssy=2%,or=h;st=sq,sbc=#5135F2,sds=35%,ssx=83%,ssy=33%,or=v;st=rt,sbc=#088395,sds=31%,ssx=17%,ssy=40%,or=h",
            workingHours: [],
            rooms: [],
            unreadMessages: [],
          },
          {
            name: {
              first: "Joe",
              last: "West",
            },
            timeZone: "(UTC-07:00) Pacific Time (US & Canada)",
            thumbnail:
              "bc=#F9A37D;st=cr,sbc=#2D4CFC,sds=37%,ssx=26%,ssy=42%,or=h",
            workingHours: [],
            rooms: [],
            unreadMessages: [],
          },
          {
            name: {
              first: "Dave",
              last: "Sanchez",
            },
            timeZone: "(UTC-05:00) Eastern Time (US & Canada)",
            thumbnail:
              "bc=#26D516;st=rt,sbc=#3077D8,sds=43%,ssx=22%,ssy=8%,or=h;st=rt,sbc=#3C6122,sds=60%,ssx=17%,ssy=0%,or=h;st=rt,sbc=#AB988E,sds=27%,ssx=5%,ssy=19%,or=v;st=cr,sbc=#A1BEFA,sds=51%,ssx=73%,ssy=44%,or=h",
            workingHours: [],
            rooms: [],
            unreadMessages: [],
          },
        ];

        await hydrateCollection(usersCollection, userItems, "users");

        const allUsers = await usersCollection.find({}).toArray();

        client.close();
        response.send(allUsers);
      };

      const hydrateCollection = async (
        collection: Collection,
        items: any[],
        label: string
      ) => {
        await collection.insertMany(items);
        const itemsCount = await collection.countDocuments({});
        console.log(`Inserted ${itemsCount} ${label}`);
      };

      await runTheDB();
    });
  });
})();
