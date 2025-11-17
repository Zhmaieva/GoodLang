import { MongoClient } from "mongodb";

const user = encodeURIComponent(process.env.MONGO_USER); // e.g. "myUser"
const pass = encodeURIComponent(process.env.MONGO_PASS); // e.g. "myPassword"
const host = process.env.MONGO_HOST || "localhost";
const port = process.env.MONGO_PORT || "27017";
const dbName = process.env.MONGO_DB || "good_lang";

// Use standard URI with auth
const uri = `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`;

const client = new MongoClient(uri);

let db = null;

export async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db(dbName);
    return db;
}
