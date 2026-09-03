import express, { Request, Response } from "express";const app = express();
import db from './db.js';
import { seedDifficulties } from './db_seed.js';
import { apiScore, difficultyDto, scoreDto, unityScore, unityUser, userDto } from "./dtos.js";
const port = 3000;

seedDifficulties();

function getAllFromDb(table: string){
    return db.prepare(`SELECT * FROM ${table}`).all()
}

function getALLFromDbPk(table: string, field: string, value: string | number){
    return db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).all(value);
}

function isUnityScore(body: any): body is unityScore {
    if (!body || typeof body !== "object") return false;
    
    return (
        body != null && body.token != null && body.score != null && body.pseudo != null && body.difficultyId != null
    );
}
function isUnityUser(body: any): body is unityUser {
    if (!body || typeof body !== "object") return false;
    
    return (
        body != null && body.token != null && body.pseudo != null
    );
}

function generateScoresToSend() : apiScore{
    const result : apiScore = {
        scores : [],
        difficulties : [],
        users : []
    }

    const userRows : userDto[] = getAllFromDb("user") as userDto[];
    for(const row of userRows){
        result.users.push({
            uid: row.uid,
            pseudo: row.pseudo
        });
    }

    const scoresRows : scoreDto[] = getAllFromDb("score") as scoreDto[];
    for (const row of scoresRows){
        result.scores.push({
            user_uid: row.user_uid,
            difficulty_id: row.difficulty_id,
            max_score: row.max_score,
            updated_at: row.updated_at
        })
    }

    const difficultyRows : difficultyDto[] = getAllFromDb("difficulty") as difficultyDto[];
    for (const row of difficultyRows){
        result.difficulties.push({
            id: row.id,
            label : row.label
        })
    }
    return result
}


function insertScore(unityScore: unityScore){
    const scoresRows : scoreDto[] =  getAllFromDb("score") as scoreDto[];

    const insertScore = db.prepare('INSERT INTO score (user_uid, difficulty_id, max_score, updated_at) VALUES (?, ?, ?, ?)');
    const updateScore = db.prepare('UPDATE score SET max_score = ?, updated_at = ? where user_uid = ? AND difficulty_id = ?')

    let scoreExists = false;
    for (const row of scoresRows){
        if(row.user_uid === unityScore.token && row.difficulty_id == unityScore.difficultyId){
            scoreExists = true;
            if(unityScore.score > row.max_score){
                updateScore.run(unityScore.score, Date.now(), unityScore.token, unityScore.difficultyId);
                console.log("updated score for difficulty " + unityScore.difficultyId + " for user " + unityScore.token);
            }
        }
    }
    if(!scoreExists){
        insertScore.run(unityScore.token, unityScore.difficultyId, unityScore.score, Date.now());
        console.log("created score for difficulty " + unityScore.difficultyId + " for user " + unityScore.token);
    }   
}

function insertUser(unityUser: unityUser){
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
        console.log("updated user " + unityUser.token)
    }
    else {
        insertUser.run(unityUser.token, unityUser.pseudo);
        console.log("created user " + unityUser.token)
    }
}

app.use(express.json());

app.post("/api", (req: Request, res: Response) => {
    if (isUnityScore(req.body)) {
        const payload: unityScore = req.body;
        console.log("got score (post) : " + payload);
        insertUser(payload);
        insertScore(payload);
        res.status(200).json(payload);
    } else if(isUnityUser(req.body)){
        const payload: unityUser = req.body;
        console.log("got user post : " + payload);
        insertUser(payload);
        res.status(200).json(payload);
    } 
    else {
        console.error("Payload invalide", req.body);
        res.status(400).json({ error: "Invalid payload format" });
    }
});

app.get("/api", (req: Request, res: Response) =>{
    try {
        const scores = generateScoresToSend();
        console.log("sent scores (get)");
        res.status(200).json(scores);
    } catch (error) {
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