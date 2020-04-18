import mongodb, { ObjectID, Collection } from "mongodb";
const { MongoClient } = mongodb;
// @ts-ignore
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

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

  const roomItems = [
    {
      members: [],
      messages: [],
    },
    {
      members: [],
      messages: [],
    },
  ];

  await hydrateCollection(roomsCollection, roomItems, "rooms");
  const allRoomItems = await roomsCollection.find({}).toArray();
  const [firstRoomItem, secondRoomItem] = allRoomItems;

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
      rooms: [firstRoomItem._id, secondRoomItem._id],
      unreadMessages: [],
    },
    {
      name: {
        first: "Joe",
        last: "West",
      },
      timeZone: "(UTC-07:00) Pacific Time (US & Canada)",
      thumbnail: "bc=#F9A37D;st=cr,sbc=#2D4CFC,sds=37%,ssx=26%,ssy=42%,or=h",
      workingHours: [],
      rooms: [firstRoomItem._id],
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
      rooms: [secondRoomItem._id],
      unreadMessages: [],
    },
  ];

  await hydrateCollection(usersCollection, userItems, "users");

  const userOne = await usersCollection.findOne({ "name.first": "Bob" });
  const userTwo = await usersCollection.findOne({ "name.first": "Joe" });
  const userThree = await usersCollection.findOne({ "name.first": "Dave" });

  const messageItems = [
    {
      sender: userOne._id,
      timeSent: 1585423791755,
      contents: "Hey Joe, this is Bob",
      room: firstRoomItem._id,
    },
    {
      sender: userTwo._id,
      timeSent: 1585623791755,
      contents: "Hey Bob, this is Joe",
      room: firstRoomItem._id,
    },
    {
      sender: userOne._id,
      timeSent: 1585423791755,
      contents: "Hey Dave, this is Bob",
      room: secondRoomItem._id,
    },
    {
      sender: userThree._id,
      timeSent: 1585623791755,
      contents: "Hey Bob, this is Dave",
      room: secondRoomItem._id,
    },
  ];

  await hydrateCollection(messagesCollection, messageItems, "messages");

  const someMessages = await messagesCollection.find({}).toArray();
  await Promise.all(
    someMessages.map(async (item) => {
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
    someUsers.map(async (user) => {
      // get user
      await Promise.all(
        user.rooms.map(async (roomId: ObjectID) => {
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

const hydrateCollection = async (
  collection: Collection,
  items: any[],
  label: string
) => {
  await collection.insertMany(items);
  const itemsCount = await collection.countDocuments({});
  console.log(`Inserted ${itemsCount} ${label}`);
};

const showAll = async (collection: Collection) => {
  console.log("--------------------------------");
  const items = await collection.find({}).toArray();
  console.log(items);
};

runTheDB();
