import { MongoClient } from "mongodb";

const uri = process.env.URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
export const db = client.db("e-commerce");

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err);
    await client.close();
    process.exit(1);
  }
}
run().catch(console.dir);

process.on("SIGINT", async function () {
  console.log("app is terminating");
  await client.close();
  process.exit(0);
});
