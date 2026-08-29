const express = require("express");
const { exec } = require("child_process");

const app = express();
const port = 3000;

type scorePayload = {
    token : string,
    score: number
}

function isScorePayload(obj : any){
    return (typeof obj.token !== 'string' || typeof obj.score !== 'number')
}

//so any browser can access the json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


app.post("/api", async (req: any, res: any) => {
    if(isScorePayload(req.body)){
        const payload : scorePayload = req.body;
        console.log(payload);
        res.status(200).json(payload)
    }
    else{
        console.log("fini");
        res.status(500)
    }
});

app.listen(port, () => {
    console.log("Dashboard running");
});