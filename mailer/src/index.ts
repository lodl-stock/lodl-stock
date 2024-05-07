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
import { mailCount, register } from "./prometheus";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/subscriptions", subscriptionRoutes);
app.get('/metrics', async (_, res) => {
  res.setHeader('Content-type', register.contentType);
  res.end(await register.metrics());
});

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
        storeProduct: { include: { product: true, _count: { select: { instances: true } } } },
        user: true
    }
  });

  subscriptions.filter((s) => {
    const prod = s.storeProduct.product;
    console.log(`Looking at ${prod.name}: ${s.storeProduct._count.instances} (S) / ${s.storeProduct.price} (P); treshold: ${s.treshold}, type: ${s.type}`);
    switch(s.type) {
        case "PRICE_BELOW": return s.storeProduct.price < s.treshold
        case "STOCK_BELOW": return s.storeProduct._count.instances < s.treshold
  }}).map((s) => {
    mailCount.inc();
    alert(s.user, s.storeProduct.product, s);
  });
});
