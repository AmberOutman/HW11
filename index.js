const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/notes", (req, res) => {
    const id = "_" + Math.random().toString(36).substr(2,9);
    fs.readFile("db.json", "utf-8", (err, data) => {
        if(err){
            console.error("ERROR: ", err);
            res.sendStatus(500);
            return;
        }
        const db = JSON.parse(data);
        const newNote = {id: id, title: req.body.title, text: req.body.text};
        db.notes.push(newNote);
        fs.writeFile("db.json", JSON.stringify(db), "utf-8", err => {
            if (err){
                console.error("ERROR: ", err);
                res.sendStatus(500);
                return;
            }
            res.send(newNote);
        });
    });
});

app.get("/api/notes", (req, res) => {
    fs.readFile("db.json", "utf-8", (err, data) => {
        if(err){
            console.error("ERROR: ", err);
            res.sendStatus(500);
            return;  
        }
        const db = JSON.parse(data);
        res.send(db.notes);
    });
});

app.delete("/api/notes/:id", (req,res) => {
    const id = req.params.id;
    fs.readFile("db.json", "utf-8", (err, data) => {
        if(err){
            console.error("ERROR: ", err);
            res.sendStatus(500);
            return;  
        }
        const db = JSON.parse(data);
        const newNotes = db.notes.filter(note => note.id !== id);
        const newDb = {notes: newNotes};
        fs.writeFile("db.json", JSON.stringify(newDb), "utf-8", err => {
            if (err){
                console.error("ERROR: ", err);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(204);
        });
    });
});

app.get("/notes", (req, res) =>{
    res.sendFile("notes.html", {root: __dirname + "/public"});
});

app.get("*", (req, res) => res.sendFile("index.html", {root: __dirname + "/public"}));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
