import express from "express";
import { ReadLine } from "readline";
import ejs from "ejs";

const app = express();

app.set("port", 3000);
app.set("view engine", "ejs")
app.use(express.static("public"))
app.get("/", (req,res)=>{
    res.render("index")
})

app.listen(app.get("port"), ()=>{
    console.log("[server] http://localhost:" + app.get("port"))
})