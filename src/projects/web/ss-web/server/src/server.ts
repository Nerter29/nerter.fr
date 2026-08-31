import express, { Request, Response } from "express";const app = express();
import db from './db.js';
import { seedDifficulties } from './db_seed.js';
import { apiScore, difficultyDto, scoreDto, unityScore, userDto } from "./dtos.js";
const port = 3000;

seedDifficulties();

function getAllFromDb(table: string){
    return db.prepare(`SELECT * FROM ${table}`).all()
}

function getALLFromDbPk(table: string, field: string, value: string | number){
    return db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).all(value);
}

function isScorePayload(body: any): body is unityScore {
    if (!body || typeof body !== "object") return false;
    
    return (
        body != null && body.token !=null && body.score != null &&
        typeof body.token === 'string' && 
        typeof body.score === 'number'
    );
}

function agregateScores() : apiScore{
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
        const users : userDto[] = getALLFromDbPk("user", "uid", row.user_uid) as userDto[]
        result.scores.push({
            user_uid: row.user_uid,
            pseudo: users[0].pseudo as string,
            difficultyId: row.difficultyId,
            max_score: row.max_score,
            updatedAt: row.updatedAt
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


function insertData(unityScore: unityScore){
    const userRows : userDto[] =  getAllFromDb("user") as userDto[];

    const insertScore = db.prepare('INSERT INTO score (user_uid, difficulty_id, max_score, updated_at) VALUES (?, ?, ?, ?)');
    const updateScore = db.prepare('UPDATE score SET max_score = ?, updated_at = ? where user_uid = ?')
    const insertUser = db.prepare('INSERT INTO user (uid, pseudo) VALUES (?, ?)');

    let userExists = false;
    for (const row of userRows){
         // TODO add pseudo verif
        if(row.uid == unityScore.token){
            userExists = true;
            const userScores : scoreDto[] = getALLFromDbPk("score", "user_uid", row.uid) as scoreDto[]
            if(unityScore.score > userScores[0].max_score){
                updateScore.run(unityScore.score, Date.now(), unityScore.token);
            }
        }
    }
    if(!userExists){
        insertUser.run(unityScore.token, "Anon"); // TODO not Anon
        insertScore.run(unityScore.token, 2, unityScore.score, Date.now()); // TODO not 2
    }   
}

app.use(express.json());

//so any browser can access the json
/* app.use((req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
}); */

app.post("/api", (req: Request, res: Response) => {
    if (isScorePayload(req.body)) {
        const payload: unityScore = req.body;
        console.log(payload);
        insertData(payload)
        res.status(200).json(payload);
    } else {
        console.log("Payload invalide");
        res.status(400).json({ error: "Invalid payload format" });
    }
});

app.get("/api", (req: Request, res: Response) =>{
    try {
        const scores = agregateScores();
        res.status(200).json(scores);
    } catch (error) {
        console.error("Erreur lors de la récupération des scores :", error);
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