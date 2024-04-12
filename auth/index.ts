import express from "express";
import bodyParser from "body-parser";
import http from "http";
import https from "https";
import fs from "fs";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config()

function requireHTTPS(req: any, res: any, next: any) {
    if (!req.secure) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

const app = express();
const PORT = process.env.PORT || 5001;

if (process.env.environment !== "dev") {
    app.enable('trust proxy');
    app.use(requireHTTPS);
}

const server = process.env.environment === "dev" ?
    http.createServer(app) :
    https.createServer({
        key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH as string),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH as string)
    }, app);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// app.use("/api/users", userRoutes)

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
