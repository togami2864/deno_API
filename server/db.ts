import { MongoClient } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
const client = new MongoClient();
const { MONGO_URI } = config();

await client.connect(MONGO_URI);

export const db = client.database("deno_rest_api");
