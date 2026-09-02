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


function insertScore(unityScore: unityScore){
    const userRows : userDto[] =  getAllFromDb("user") as userDto[];

    const insertScore = db.prepare('INSERT INTO score (user_uid, difficulty_id, max_score, updated_at) VALUES (?, ?, ?, ?)');
    const updateScore = db.prepare('UPDATE score SET max_score = ?, updated_at = ? where user_uid = ?')
    const insertUser = db.prepare('INSERT INTO user (uid, pseudo) VALUES (?, ?)');

    let error = false;
    let userExists = false;
    for (const row of userRows){
        if(row.uid == unityScore.token){
            userExists = true;
            const userScores : scoreDto[] = getALLFromDbPk("score", "user_uid", row.uid) as scoreDto[]
            if(unityScore.score > userScores[0].max_score){
                updateScore.run(unityScore.score, Date.now(), unityScore.token);
            }
        }
        if(row.pseudo == unityScore.pseudo && !userExists){
            console.error("Pseudo Already Exists");
            error = true;
            break;
        }
    }
    if(!userExists && !error){
        insertUser.run(unityScore.token, unityScore.pseudo);
        insertScore.run(unityScore.token, unityScore.difficultyId, unityScore.score, Date.now());
    }   
}

function insertUser(unityUser: unityUser){
    const userRows : userDto[] =  getAllFromDb("user") as userDto[];

    const insertUser = db.prepare('INSERT INTO user (uid, pseudo) VALUES (?, ?)');
    const updateUser = db.prepare('UPDATE user SET pseudo = ? where uid = ?');

    let error = false;
    let userExists = false;
    for (const row of userRows){
        if(row.uid == unityUser.token){
            userExists = true;
        }
        else if(row.pseudo == unityUser.pseudo){
            console.error("Pseudo Already Exists");
            error = true;
            break;
        }
    }
    if(!error){
        if(userExists){
            updateUser.run(unityUser.pseudo, unityUser.token);
        }
        else{
            insertUser.run(unityUser.token, unityUser.pseudo);
        }
    }   
}

app.use(express.json());

app.post("/api", (req: Request, res: Response) => {
    if (isUnityScore(req.body)) {
        const payload: unityScore = req.body;
        console.log("got score : " + payload);
        insertScore(payload)
        res.status(200).json(payload);
    } else if(isUnityUser(req.body)){
        const payload: unityUser = req.body;
        console.log("got user : " + payload);
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