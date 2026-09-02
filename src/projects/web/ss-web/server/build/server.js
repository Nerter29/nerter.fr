import express from "express";
const app = express();
import db from './db.js';
import { seedDifficulties } from './db_seed.js';
const port = 3000;
seedDifficulties();
function getAllFromDb(table) {
    return db.prepare(`SELECT * FROM ${table}`).all();
}
function getALLFromDbPk(table, field, value) {
    return db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).all(value);
}
function isUnityScore(body) {
    if (!body || typeof body !== "object")
        return false;
    return (body != null && body.token != null && body.score != null && body.pseudo != null && body.difficultyId != null);
}
function isUnityUser(body) {
    if (!body || typeof body !== "object")
        return false;
    return (body != null && body.token != null && body.pseudo != null);
}
function generateScoresToSend() {
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
function insertScore(unityScore) {
    const scoresRows = getAllFromDb("score");
    const insertScore = db.prepare('INSERT INTO score (user_uid, difficulty_id, max_score, updated_at) VALUES (?, ?, ?, ?)');
    const updateScore = db.prepare('UPDATE score SET max_score = ?, updated_at = ? where user_uid = ?');
    let scoreExists = false;
    for (const row of scoresRows) {
        if (row.user_uid === unityScore.token && row.difficultyId == unityScore.difficultyId) {
            scoreExists = true;
            if (unityScore.score > row.max_score) {
                updateScore.run(unityScore.score, Date.now(), unityScore.token);
            }
        }
    }
    if (!scoreExists) {
        insertScore.run(unityScore.token, unityScore.difficultyId, unityScore.score, Date.now());
    }
}
function insertUser(unityUser) {
    const existingPseudo = db.prepare('SELECT uid FROM user WHERE pseudo = ? AND uid != ?').get(unityUser.pseudo, unityUser.token);
    if (existingPseudo) {
        console.log("Pseudo Already Exists");
        return;
    }
    const insertUser = db.prepare('INSERT INTO user (uid, pseudo) VALUES (?, ?)');
    const updateUser = db.prepare('UPDATE user SET pseudo = ? where uid = ?');
    let userExists = db.prepare('SELECT 1 FROM user WHERE uid = ?').get(unityUser.token) != undefined;
    if (userExists) {
        updateUser.run(unityUser.pseudo, unityUser.token);
    }
    else {
        insertUser.run(unityUser.token, unityUser.pseudo);
    }
}
app.use(express.json());
app.post("/api", (req, res) => {
    if (isUnityScore(req.body)) {
        const payload = req.body;
        console.log("got score : " + payload);
        insertUser(payload);
        insertScore(payload);
        res.status(200).json(payload);
    }
    else if (isUnityUser(req.body)) {
        const payload = req.body;
        console.log("got user : " + payload);
        insertUser(payload);
        res.status(200).json(payload);
    }
    else {
        console.error("Payload invalide", req.body);
        res.status(400).json({ error: "Invalid payload format" });
    }
});
app.get("/api", (req, res) => {
    try {
        const scores = generateScoresToSend();
        res.status(200).json(scores);
    }
    catch (error) {
        console.error("Score fetching error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.listen(port, () => {
    console.log("Scoreboard running");
});
// db.prepare('DELETE FROM score').run();
// db.prepare('DELETE FROM user').run();
const rows = db.prepare(`SELECT * FROM score`).all();
console.log(rows);
