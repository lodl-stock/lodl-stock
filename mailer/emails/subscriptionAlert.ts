import { ConditionType, Product, Subscription, User } from "@prisma/client";
import transporter from "../transporter";
import prisma from "../prisma_client";

export default async function alert(user: User, product: Product, sub: Subscription) {
    console.log(`alerting ${user.first_name} of ${product.name}`);

    const alertedOn = sub.type == ConditionType.PRICE_BELOW ? "price" : "stock";

    await transporter.sendMail({
        from: 'Lodl Stock <noreply@lodlstock.com>',
        to: user.email,
        subject: `${product.name}'s ${alertedOn} has gone below ${sub.treshold}`,
        html: `<p>Beware, weary traveler! <b>${product.name}'s</b> ${alertedOn} has fallen below ${sub.treshold}.`
    });

    // We only notify once
    await prisma.subscription.delete({ where: {
        userId_storeProductId: {
            userId: sub.userId,
            storeProductId: sub.storeProductId
        }
    }});
}
