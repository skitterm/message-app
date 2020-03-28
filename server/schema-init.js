const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" });

const runTheDB = async () => {
  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  const db = client.db("messageApp");

  const messagesCollection = db.collection("messages");
  const roomsCollection = db.collection("rooms");
  const usersCollection = db.collection("users");

  await messagesCollection.deleteMany({});
  await roomsCollection.deleteMany({});
  await usersCollection.deleteMany({});

  const roomItems = [
    {
      members: [],
      messages: []
    },
    {
      members: [],
      messages: []
    }
  ];

  await hydrateCollection(roomsCollection, roomItems, "rooms");
  const roomItem = await roomsCollection.findOne({});

  const userItems = [
    {
      name: {
        first: "Bob",
        last: "Johnson"
      },
      timeZone: "pacific",
      profileImageUrl: "",
      workingHours: [],
      rooms: [roomItem._id],
      unreadMessages: []
    },
    {
      name: {
        first: "Joe",
        last: "West"
      },
      timeZone: "pacific",
      profileImageUrl: "",
      workingHours: [],
      rooms: [roomItem._id],
      unreadMessages: []
    }
  ];

  await hydrateCollection(usersCollection, userItems, "users");

  const userOne = await usersCollection.findOne({ "name.first": "Bob" });
  const userTwo = await usersCollection.findOne({ "name.first": "Joe" });

  const messageItems = [
    {
      sender: userOne._id,
      timeSent: 1234,
      contents: "Hey Joe, this is Bob",
      room: roomItem._id
    },
    {
      sender: userTwo._id,
      timeSent: 5678,
      contents: "Hey Bob, this is Joe",
      room: roomItem._id
    }
  ];

  await hydrateCollection(messagesCollection, messageItems, "messages");

  const someMessages = await messagesCollection.find({}).toArray();
  await Promise.all(
    someMessages.map(async item => {
      // get room
      const room = await roomsCollection.findOne({ _id: item.room });
      // put it in messages
      await roomsCollection.updateOne(
        { _id: room._id },
        { $addToSet: { messages: item._id } }
      );
    })
  );

  const someUsers = await usersCollection.find({}).toArray();
  await Promise.all(
    someUsers.map(async user => {
      // get user
      await Promise.all(
        user.rooms.map(async roomId => {
          const room = await roomsCollection.findOne({ _id: roomId });
          // put it in rooms.members
          await roomsCollection.updateOne(
            { _id: room._id },
            { $addToSet: { members: user._id } }
          );
        })
      );
    })
  );

  await showAll(roomsCollection);
  await showAll(usersCollection);
  await showAll(messagesCollection);

  client.close();
};

const hydrateCollection = async (collection, items, label) => {
  await collection.insertMany(items);
  const itemsCount = await collection.countDocuments({});
  console.log(`Inserted ${itemsCount} ${label}`);
};

const showAll = async collection => {
  console.log("--------------------------------");
  const items = await collection.find({}).toArray();
  console.log(items);
};

runTheDB();
