import { Router } from 'express';
import { Characters } from '../../interface';
import { getCharacters, searchAndSortCharacters, sortFields, sortDirections } from '../../database';
import dotenv from "dotenv";

dotenv.config();

let characterData: Characters[] = [];
const router = Router();

router.get("/", async (req, res) => {
    try {
        // Sorteerparameters
        const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
        const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : 'asc';
        
        // Zoekparameter
        const searchQuery = typeof req.query.q === "string" ? req.query.q : "";
        
        // Converteer de sortDirection naar numeriek
        const numericSortDirection = sortDirection === 'asc' ? 1 : -1;
        
        // Haal de karakters op met behulp van de zoek- en sorteermethode
        const characters = await searchAndSortCharacters(sortField, numericSortDirection, searchQuery);
        
        // Render de pagina met de gesorteerde karakters en sorteer- en richtingsopties
        res.render("index", { 
            characters: characters,
            sortFields: sortFields,
            sortDirections: sortDirections,
            sortField: sortField,
            sortDirection: sortDirection,
            q: searchQuery
        }); 
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal server error');
    }
});




router.get("/teams", async (req, res) => {
    const data = await getCharacters();
    res.render("teams", { 
        characters: data
    }); 
});

router.get("/cards", async (req,res)=>{
    const data = await getCharacters();
    res.render("cards",{
        characters: data
    });
});

router.get("/characters/:id", async (req, res) => {
    const data = await getCharacters();
    const characterId = req.params.id;

    const characters: Characters[] = data.filter((character: Characters) => character.id === characterId);
    if (!characters) {
        return res.status(404).send("Character not found");
    }
        res.render("cards", { characters: characters });
});

router.get("/teams/:id", async (req, res) => {
    const data = await getCharacters();
    const characterId = req.params.id;
    const characters: Characters[] = data.filter((character: Characters) => character.id === characterId);
    if (!characters) {
        return res.status(404).send("Character not found");
    }
        res.render("teamCards", { characters: characters });
});

export default router;