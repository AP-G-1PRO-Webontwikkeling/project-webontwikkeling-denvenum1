import { Router } from 'express';
import { Characters, User } from '../../interface';
import { getCharacters, searchAndSortCharacters, sortFields, sortDirections,getCharacterById, updateCharacter, loginUser} from '../../database';
import dotenv from "dotenv";

dotenv.config();

const router = Router();
let characters: Characters[] = [];
// Router
router.get("/", async (req, res) => {
    try {
        if (req.session.user) {
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
                user: req.session.user,
                characters: characters,
                sortFields: sortFields,
                sortDirections: sortDirections,
                sortField: sortField,
                sortDirection: sortDirection,
                q: searchQuery
            }); 
    } else {
        res.redirect("/login");
    }
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

router.get("/cards", async (req, res) => {
    const data = await getCharacters();
    res.render("cards", {
        characters: data,
    });
});


router.get("/characters/:id", async (req, res) => {
    const data = await getCharacters();
    const characterId = req.params.id;

    const characters: Characters[] = data.filter((character: Characters) => character.id === characterId);
    if (!characters) {
        return res.status(404).send("Character not found");
    }
        res.render("cards", { characters: characters,
        role: req.session.user?.role 
         });
});


router.get("/characters/:id/edit", async (req, res) => {
    const characterId = req.params.id;
    try {
        const character = await getCharacterById(characterId);
        if (!character) {
            return res.status(404).send("Character not found");
        }
        res.render("editCards", { character: character });
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).send('Internal server error');
    }
});

router.post("/characters/:id/edit", async (req, res) => {
    const characterId = req.params.id;
    const updatedCharacterData = req.body as Characters; // Typecasting naar het Characters-interface

    // Bepaal de URL van het rol symbool op basis van de geselecteerde rol
    let roleSymbolURL = "";
    switch (updatedCharacterData.role) {
        case "Duelist":
            roleSymbolURL = "https://raw.githubusercontent.com/denvenum1/ProjectWebontwikkeling/main/Duelist.png";
            break;
        case "Initiator":
            roleSymbolURL = "https://raw.githubusercontent.com/denvenum1/ProjectWebontwikkeling/main/Initiator.png";
            break;
        case "Controller":
            roleSymbolURL = "https://raw.githubusercontent.com/denvenum1/ProjectWebontwikkeling/main/Controller.png";
            break;
        case "Sentinel":
            roleSymbolURL = "https://raw.githubusercontent.com/denvenum1/ProjectWebontwikkeling/main/Sentinel.png";
            break;
        default:
            roleSymbolURL = "https://raw.githubusercontent.com/denvenum1/ProjectWebontwikkeling/main/default.png";
    }

    // Voeg de URL van het rol symbool toe aan de bijgewerkte karaktergegevens
    updatedCharacterData.roleSymbol = roleSymbolURL;

    // Update de karaktergegevens in de database
    try {
        await updateCharacter(characterId, updatedCharacterData);
        res.redirect("/"); // Stuur de gebruiker terug naar de hoofdpagina
    } catch (error) {
        console.error('Error updating character:', error);
        res.status(500).send('Internal server error');
    }
});

router.get("/login", async (req, res) => {
    res.render("login", { fortnite: characters });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await loginUser(username, password);
        if (user) {
            req.session.user = { 
                username: user.username, 
                password: user.password,
                role: user.role 
            };
            return res.redirect('/');
        } else {
            return res.render('login', {
                message: 'Foute gebruikersnaam of wachtwoord!',
            });
        }
    } catch (error) {
        console.error('Er is een fout opgetreden tijdens het inloggen:', error);
        return res.redirect('/login');
    }
});

router.post("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
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