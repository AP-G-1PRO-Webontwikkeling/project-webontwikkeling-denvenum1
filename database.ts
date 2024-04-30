import { Collection, MongoClient } from "mongodb";
import { Characters } from "./interface";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.URI || "mongodb+srv://denvenum1:123@projectwebontwikkeling.kwqzi3l.mongodb.net/";
const client = new MongoClient(uri);

const collectionCharacters: Collection<Characters> = client.db("projectwebontwikkeling").collection<Characters>("Characters");

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function getCharacters() {
    return await collectionCharacters.find({}).toArray();
}

export async function loadCharactersFromApi() {
    const Characters: Characters[] = await getCharacters();

    if (Characters.length == 0) {
        console.log("Database is leeg, characters uit API halen nu...")
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-denvenum1/main/characters.json");
        const Characters: Characters[] = await response.json();
        await collectionCharacters.insertMany(Characters);
    }
}

export async function connect() {
    try {
        await client.connect();
        await loadCharactersFromApi();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}
