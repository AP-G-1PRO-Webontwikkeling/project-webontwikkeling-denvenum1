import { Collection, MongoClient } from "mongodb";
import { Characters } from "./interface";
import dotenv from "dotenv";
import { User } from "./interface";
import bcrypt from "bcrypt";

dotenv.config();

const saltRounds : number = 10;
export const uri = process.env.URI || "mongodb+srv://denvenum1:123@projectwebontwikkeling.kwqzi3l.mongodb.net/";
const client = new MongoClient(uri);

export const userCollection = client.db("projectwebontwikkeling").collection<User>("users");
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

        // Retourneer de gesorteerde resultaten
        return result;
    } catch (error) {
        console.error('Error searching and sorting characters:', error);
        throw error;
    }
}

// Database functies
export async function getCharacterById(id: string) {
    return await collectionCharacters.findOne({ id: id });
}

export async function updateCharacter(id: string, updatedData: Characters) {
    try {
        await collectionCharacters.updateOne({ id: id }, { $set: updatedData });
    } catch (error) {
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

//login
async function createDefaultUsers() {
    try {
        // Voeg de admin gebruiker toe
        await registerUser("admin", "admin_password", "ADMIN");

        // Voeg de standaard gebruiker toe
        await registerUser("user", "user_password", "USER");

        console.log("Default users created successfully.");
    } catch (error) {
        console.error("Error creating default users:", error);
    }
}

export async function registerUser(username :string | undefined, password : string | undefined, role : "ADMIN" | "USER") {
    if (username === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        username: username,
        password: await bcrypt.hash(password, saltRounds),
        role: role
    });
}

export async function loginUser(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function connect() {
    try {
        await client.connect();
        await createDefaultUsers();
        await loadCharactersFromApi();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}
