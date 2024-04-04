import { Router } from "express";
import * as nodemailer from "nodemailer";
import validators from "../helpers/validators"
import prisma from "../prisma_client";
import { ConditionType } from "@prisma/client";

const router = Router();

router.post("/", async (req, res) => {
    const { error } = validators.subscriptionCreate.validate(req.body);
    if (error) return res.send(error.details[0].message);

    try {
        let { type, treshold, userId, productId } = req.body;

        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.mailUser,
                pass: process.env.mailPass
            }
        });

        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.send("This user does not exist!");
        }
        let product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.send("This product does not exist!");
        }

        await transporter.sendMail({
            from: 'Lodl Stock <noreply@lodlstock.com>',
            to: user.email,
            subject: "Your Subscription",
            html: `<p>Your subscription has been created. You'll be notified when <b>${product.name}'s</b> ${type == ConditionType.PRICE_BELOW ? "stock" : "price"} goes below ${treshold}.`
        });

        return res.send(undefined);
    } catch(e) {
        console.log(e)
        return res.send(`Failed to record subscription for ${req.body}!`);
    }
})

export default router;
