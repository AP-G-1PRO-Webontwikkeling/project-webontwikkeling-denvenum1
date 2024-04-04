import express from "express";
fetchData()
async function fetchData() {
    
    try {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-denvenum1/main/characters.json");
        
        if (!response.ok) {
            throw new Error("could not fetch resource");
            
        }
        const data = await response.json();
        console.log(data.characters[0])
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
    res.render("index", { data: data });
});

app.listen(app.get("port"), async()=>{
    
    console.log("[server] http://localhost:" + app.get("port"))
})