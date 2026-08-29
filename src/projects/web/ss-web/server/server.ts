import express from "express";
const app = express();
const port = 3000;

type scorePayload = {
    token : string,
    score: number
}

function isScorePayload(body: any): body is scorePayload {
    return (
        !!body && 
        typeof body.token === 'string' && 
        typeof body.score === 'number'
    );
}

app.use(express.json());

//so any browser can access the json
app.use((req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


app.post("/api", async (req: any, res: any) => {
    if(isScorePayload(req.body)){
        const payload : scorePayload = req.body;
        console.log(payload);
        res.status(200).json(payload)
    }
    else {
        console.log("Payload invalide");
        res.status(400).json({ error: "Invalid payload format" });
    }
});

app.listen(port, () => {
    console.log("Scoreboard running");
});