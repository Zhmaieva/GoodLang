import { MongoClient } from "mongodb";

const user = encodeURIComponent(process.env.MONGO_USER); // e.g. "myUser"
const pass = encodeURIComponent(process.env.MONGO_PASS); // e.g. "myPassword"
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT || "27017";
const dbName = process.env.MONGO_DB || "good_lang";

// Use standard URI with auth
const uri = host
    ? `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`
    : `mongodb://127.0.0.1:27017?socketTimeoutMS=1000&connectTimeoutMS=1000&serverSelectionTimeoutMS=1000`;

const client = new MongoClient(uri);

let db = null;

export async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db(dbName);
    return db;
}
