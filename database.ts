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

//characters
export async function getCharacters() {
    return await collectionCharacters.find({}).toArray();
}

async function loadCharactersFromApi() {
    const Characters: Characters[] = await getCharacters();

    if (Characters.length == 0) {
        console.log("Database is leeg, characters uit API halen nu...")
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-denvenum1/main/characters.json");
        const Characters: Characters[] = await response.json();
        await collectionCharacters.insertMany(Characters);
    }
}
export async function searchAndSortCharacters(sortField: string, sortDirection: number, searchQuery: string) {
    let query: any = {};

    // Voeg de zoekquery toe aan de query als deze is opgegeven
    if (searchQuery) {
        query.name = { $regex: searchQuery, $options: 'i' };
    }

    try {
        // Maak een leeg sorteerobject aan
        let sortParams: any = {};

        // Voeg de sorteerparameter toe aan het sorteerobject
        sortParams[sortField] = sortDirection;

        // Voer de zoekopdracht uit met de gegeven parameters
        let result = await collectionCharacters.find(query).toArray();

        // Pas de sorteerinstellingen toe op het resultaat
        result.sort((a: any, b: any) => {
            if (a[sortField] < b[sortField]) return sortDirection === 1 ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortDirection === 1 ? 1 : -1;
            return 0;
        });

        return result;
    } catch (error) {
        console.error('Error searching and sorting characters:', error);
        throw error;
    }
}



//input waarde
export const sortFields = [
    { value: 'name', text: 'NAME' },
    { value: 'birthdate', text: 'BIRTDATE' },
    { text: "ABILITIES" },
    { value: 'role', text: 'ROLE' },
    { value: 'available', text: 'AVAILABLE' },
    { text: 'VIEW' }
];

export const sortDirections = [
    { value: 'asc', text: 'Ascending' },
    { value: 'desc', text: 'Descending' }
];

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
