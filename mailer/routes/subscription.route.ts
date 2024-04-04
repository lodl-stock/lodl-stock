import { Router } from "express";
import * as nodemailer from "nodemailer";
import validators from "../helpers/validators"

const router = Router();

router.post("/", async (req, res) => {
    const { error } = validators.subscriptionCreate.validate(req.body);
    if (error) return res.send(error.details[0].message);

    try {
        let { teamName, name, email, message } = req.body;

        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.mailUser,
                pass: process.env.mailPass
            }
        });

        await transporter.sendMail({
            from: '"' + teamName + '" <' + email + '>',
            to: process.env.mailUser,
            subject: `Mesaj nou de la ${name} din echipa "${teamName}", ${email}`,
            html: `<p>${message}</p><br><b>Adresa de e-mail: ${email}</b>`
        });

        return res.send(undefined);
    } catch(e) {
        console.log(e)
        return res.send("Contact failed!")
    }
})

export default router;