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
    const characters: Characters[] = data.characters;
    const q: string = req.query.q?.toString() ?? "";
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    
    let filteredCharacters: Characters[] = characters.filter((character) => {
        return character.name.toLowerCase().startsWith(q.toLowerCase());
    });
    
    let sortedCharacters: Characters[] = [...filteredCharacters].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === "birthdate") {
            return sortDirection === "asc" ? a.birthdate - b.birthdate : b.birthdate - a.birthdate;
        } else if (sortField === "role") {
            return sortDirection === "asc" ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role);
        } else if (sortField === "available") {
            return sortDirection === "asc" ? (a.available === b.available ? 0 : a.available ? -1 : 1) : (a.available === b.available ? 0 : a.available ? 1 : -1);
        } else {
            return 0;
        }
    });

    const sortFields = [
        { value: 'name', text: 'name', selected: sortField === 'name' ? 'selected' : '' },
        { value: 'birthdate', text: 'birthdate', selected: sortField === 'birthdate' ? 'selected' : ''},
        { value: "abilities", text: "abilities"},
        { value: 'role', text: 'role', selected: sortField === 'role' ? 'selected' : ''},
        { value: 'available', text: 'available', selected: sortField === 'available' ? 'selected' : ''},
        { value: 'view', text: 'view'}
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

app.listen(app.get("port"), async()=>{
    
    console.log("server http://localhost:" + app.get("port"))
})