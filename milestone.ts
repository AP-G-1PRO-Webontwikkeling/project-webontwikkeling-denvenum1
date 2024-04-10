import express from "express";
import { Characters } from "./interface";
fetchData()
async function fetchData() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-denvenum1/main/characters.json");
        
        if (!response.ok) {
            throw new Error("could not fetch resource");
            
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const app = express();
app.set("port", 3000);
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", async (req, res) => {
    const data = await fetchData();
    const q : string = req.query.q?.toString() ?? "";
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    
    let filteredCharacters: Characters[] = data.filter((character:any) => {
        return character.name.toLowerCase().startsWith(q.toLowerCase());
    });
    
    let sortedCharacters: Characters[] = [...filteredCharacters].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === "birthdate") {
            return sortDirection === "asc" ? a.birthdate.localeCompare(b.birthdate) : b.birthdate.localeCompare(a.birthdate);
        } else if (sortField === "role") {
            return sortDirection === "asc" ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role);
        } else if (sortField === "available") {
            return sortDirection === "asc" ? (a.available === b.available ? 0 : a.available ? -1 : 1) : (a.available === b.available ? 0 : a.available ? 1 : -1);
        } else {
            return 0;
        }
    });

    const sortFields = [
        { value: 'name', text: 'NAME', selected: sortField === 'name' ? 'selected' : '' },
        { value: 'birthdate', text: 'BIRTDATE', selected: sortField === 'birthdate' ? 'selected' : ''},
        { text: "ABILITIES"},
        { value: 'role', text: 'ROLE', selected: sortField === 'role' ? 'selected' : ''},
        { value: 'available', text: 'AVAILABLE', selected: sortField === 'available' ? 'selected' : ''},
        { text: 'VIEW'}
    ];

    const sortDirections = [
        { value: 'asc', selected: sortDirection === 'asc' ? 'selected' : ''},
        { value: 'desc', selected: sortDirection === 'desc' ? 'selected' : ''}
    ];
    
    res.render("index", { 
        characters: sortedCharacters,
        q: q,
        sortFields: sortFields,
        sortDirections: sortDirections,
        sortField: sortField,
        sortDirection: sortDirection
    }); 
});
app.get("/teams", async (req, res) => {
    const data = await fetchData();
    res.render("teams", { 
        characters: data
    }); 
});

app.get("/cards", async (req,res)=>{
    const data = await fetchData();
    res.render("cards",{
        characters: data
    });
});

app.get("/characters/:id", async (req, res) => {
    const data = await fetchData();
    const characterId = req.params.id;
    const characters: Characters[] = data.filter((character: Characters) => character.id === characterId);
    if (!characters) {
        return res.status(404).send("Character not found");
    }
        res.render("cards", { characters: characters });
});

app.get("/teams/:id", async (req, res) => {
    const data = await fetchData();
    const characterId = req.params.id;
    const characters: Characters[] = data.filter((character: Characters) => character.id === characterId);
    if (!characters) {
        return res.status(404).send("Character not found");
    }
        res.render("teamCards", { characters: characters });
});

app.listen(app.get("port"), async()=>{
    console.log("server http://localhost:" + app.get("port"))
})