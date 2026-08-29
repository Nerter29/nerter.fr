import express from "express";
const app = express();
const port = 3000;
function isScorePayload(obj) {
    return (typeof obj.token !== 'string' || typeof obj.score !== 'number');
}
app.use(express.json());
//so any browser can access the json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.post("/api", async (req, res) => {
    if (isScorePayload(req.body)) {
        const payload = req.body;
        console.log(payload);
        res.status(200).json(payload);
    }
    else {
        console.log("fini");
        res.status(400);
    }
});
app.listen(port, () => {
    console.log("Scoreboard running");
});
