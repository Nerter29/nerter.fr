import express from "express";
const app = express();
const port = 3000;
function isScorePayload(body) {
    if (!body || typeof body !== "object")
        return false;
    return (body != null && body.token != null && body.score != null &&
        typeof body.token === 'string' &&
        typeof body.score === 'number');
}
app.use(express.json());
//so any browser can access the json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.post("/api", (req, res) => {
    if (isScorePayload(req.body)) {
        const payload = req.body;
        console.log(payload);
        res.status(200).json(payload);
    }
    else {
        console.log("Payload invalide");
        res.status(400).json({ error: "Invalid payload format" });
    }
});
app.listen(port, () => {
    console.log("Scoreboard running");
});
