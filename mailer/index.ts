import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { subscriptionRoutes } from "./routes"
import * as dotenv from "dotenv";
import prisma from "./prisma_client";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/subscriptions", subscriptionRoutes);


prisma.$connect().then(() => {
    console.log('Connected to MariaDB');
    server.listen(PORT, () => {
        console.log(`listening on *:${PORT}`);
    });
});
