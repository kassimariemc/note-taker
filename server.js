// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

const dbDir = path.resolve(__dirname, "db");
const rawData = fs.readFileSync(path.resolve(dbDir, "db.json"));
const dbNotes = JSON.parse(rawData);

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
// =============================================================

// API Routes
// Function to set ids for each note
const setIds = () => {
  for (let i = 0; i < dbNotes.length; i++) {
    dbNotes[i].id = i;
  }
}
// Displays all notes in JSON
app.get("/api/notes", function (req, res) {
  setIds();
  return res.json(dbNotes);
});

// Create new note
app.post("/api/notes", function (req, res) {
  const newNote = req.body;
  dbNotes.push(newNote);

  setIds();

  fs.writeFileSync(path.resolve(dbDir, "db.json"), JSON.stringify(dbNotes), 'utf-8');
  res.json(newNote);
});

// Delete note by id
app.delete("/api/notes/:id", function (req, res) {
  let idtoDelete = req.params.id;

  setIds();
  dbNotes.splice(idtoDelete, 1);

  fs.writeFileSync(path.resolve(dbDir, "db.json"), JSON.stringify(dbNotes), 'utf-8');
  res.json(dbNotes);
})

// HTML Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});