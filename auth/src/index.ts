import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import * as dotenv from "dotenv";
import { authRoutes } from "./routes";
import prisma from "./prisma_client";
import { register } from "./prometheus";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.get('/metrics', async (_, res) => {
    res.setHeader('Content-type', register.contentType);
    res.end(await register.metrics());
});

prisma.$connect().then(() => {
    console.log('Connected to MariaDB');
    // seed();
    server.listen(PORT, () => {
        console.log(`listening on *:${PORT}`);
    });
});
