import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { subscriptionRoutes } from "./routes"
import * as dotenv from "dotenv";
import prisma from "./prisma_client";
import seed from "./prisma/seeder";
import cron from 'node-cron';
import { alert } from "./emails";

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
    seed();
    server.listen(PORT, () => {
        console.log(`listening on *:${PORT}`);
    });
});

// We run a cron job every minute to send email alerts
cron.schedule('* * * * *', async () => {
  console.log('running through subscriptions...');
  const subscriptions = await prisma.subscription.findMany({
    include: {
        product: { include: { product: true }},
        user: true
    }
  });

  subscriptions.filter((s) => {
    const prod = s.product.product;
    console.log(`Looking at ${prod.name}: ${s.product.stock} (S) / ${s.product.price} (P); treshold: ${s.treshold}, type: ${s.type}`);
    switch(s.type) {
        case "PRICE_BELOW": return s.product.price < s.treshold
        case "STOCK_BELOW": return s.product.stock < s.treshold
  }}).map((s) => alert(s.user, s.product.product, s));
});
