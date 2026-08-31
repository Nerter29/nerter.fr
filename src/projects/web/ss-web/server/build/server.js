import express from "express";
const app = express();
import db from './db.js';
const port = 3000;
function getAllFromDb(table) {
    return db.prepare(`SELECT * FROM ${table}`).all();
}
function getALLFromDbPk(table, field, value) {
    return db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).all(value);
}
function isScorePayload(body) {
    if (!body || typeof body !== "object")
        return false;
    return (body != null && body.token != null && body.score != null &&
        typeof body.token === 'string' &&
        typeof body.score === 'number');
}
function agregateScores() {
    const result = {
        scores: [],
        difficulties: [],
        users: []
    };
    const userRows = getAllFromDb("user");
    for (const row of userRows) {
        result.users.push({
            uid: row.uid,
            pseudo: row.pseudo
        });
    }
    const scoresRows = getAllFromDb("score");
    for (const row of scoresRows) {
        const users = getALLFromDbPk("user", "uid", row.user_uid);
        result.scores.push({
            user_uid: row.user_uid,
            pseudo: users[0].pseudo,
            difficultyId: row.difficultyId,
            max_score: row.max_score,
            updatedAt: row.updatedAt
        });
    }
    const difficultyRows = getAllFromDb("difficulty");
    for (const row of difficultyRows) {
        result.difficulties.push({
            id: row.id,
            label: row.label
        });
    }
    return result;
}
function insertData(unityScore) {
    const userRows = getAllFromDb("user");
    const insertScore = db.prepare('INSERT INTO score (user_uid, difficulty_id, max_score, updated_at) VALUES (?, ?, ?, ?)');
    const updateScore = db.prepare('UPDATE score SET max_score = ?, updated_at = ? where user_uid = ?');
    const insertUser = db.prepare('INSERT INTO user (uid, pseudo) VALUES (?, ?)');
    let userExists = false;
    for (const row of userRows) {
        // TODO add pseudo verif
        if (row.uid == unityScore.token) {
            userExists = true;
            const userScores = getALLFromDbPk("score", "user_uid", row.uid);
            if (unityScore.score > userScores[0].max_score) {
                updateScore.run(unityScore.score, Date.now(), unityScore.token);
            }
        }
    }
    if (!userExists) {
        insertUser.run(unityScore.token, "Anon"); // TODO not Anon
        insertScore.run(unityScore.token, 2, unityScore.score, Date.now()); // TODO not 2
    }
}
app.use(express.json());
//so any browser can access the json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.post("/api", (req, res) => {
    if (isScorePayload(req.body)) {
        const payload = req.body;
        console.log(payload);
        insertData(payload);
        res.status(200).json(payload);
    }
    else {
        console.log("Payload invalide");
        res.status(400).json({ error: "Invalid payload format" });
    }
});
app.get("/api", (req, res) => {
    const scores = agregateScores();
    res.json(scores);
});
app.listen(port, () => {
    console.log("Scoreboard running");
});
// db.prepare('DELETE FROM score').run();
// db.prepare('DELETE FROM user').run();
const rows = db.prepare(`SELECT * FROM score`).all();
console.log(rows);
