import { ConditionType, Product, Subscription, User } from "@prisma/client";
import transporter from "../transporter";

export default function confirm(user: User, product: Product, sub: Subscription) {
    return transporter.sendMail({
        from: 'Lodl Stock <noreply@lodlstock.com>',
        to: user.email,
        subject: "Your Subscription",
        html: `<p>Your subscription has been created. You'll be notified when <b>${product.name}'s</b> ${sub.type == ConditionType.PRICE_BELOW ? "price" : "stock"} goes below ${sub.treshold}.`
    });
}
