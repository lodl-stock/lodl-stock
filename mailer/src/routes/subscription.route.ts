import { Router } from "express";
import validators from "../helpers/validators"
import prisma from "../prisma_client";
import { confirm } from "../emails";

const router = Router();

router.post("/", async (req, res) => {
    const { error } = validators.subscriptionCreate.validate(req.body);
    if (error) return res.send(error.details[0].message);

    try {
        let { type, treshold, userId, storeProductId } = req.body;

        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.send("This user does not exist!");
        }
        let storeProduct = await prisma.storeProduct.findUnique({
            where: { id: storeProductId },
            include: { product: true }
        });
        if (!storeProduct) {
            return res.send("This product does not exist!");
        }

        const sub = await prisma.subscription.create({
            data: {
                "type": type,
                "treshold": treshold,
                "userId": userId,
                "storeProductId": storeProductId,
            }});

        await confirm(user, storeProduct.product, sub);

        return res.send(undefined);
    } catch(e) {
        console.log(e)
        return res.send(`Failed to record subscription for ${req.body}!`);
    }
})

export default router;
