
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("timetable.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Slots (slot TEXT PRIMARY KEY, day TEXT, start TEXT, end TEXT)");
});

app.post("/api/admin/slots", (req, res) => {
  const { slot, day, start, end } = req.body;
  db.run("INSERT INTO Slots VALUES (?, ?, ?, ?)", [slot, day, start, end], err => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
});

app.get("/api/slots", (req, res) => {
  db.all("SELECT * FROM Slots", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
