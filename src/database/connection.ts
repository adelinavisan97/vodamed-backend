import { MongoClient, Db } from "mongodb";

const uri = config.mongoURL;
const client = new MongoClient(uri);

let db: Db;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db("MyFirstDatabase");
    console.log("Connected to database");
  } catch (error) {
    console.error("Could not connect to database", error);
    process.exit(1);
  }
};

export const getDb = () => db;