import {Router} from "express";
import * as bcrypt from 'bcrypt';
import prisma from "../prisma_client";
import validators from "../helpers/validators";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
    const { error, value: body } = validators.register.validate(req.body);

    if (error) return res.send(error.details[0].message);

    req.body = body;

    try {
        const { firstName, lastName, phoneNumber, email,
            password, confPassword } = req.body;

        if (password != confPassword) res.send("Passwords missmatch.");

        let user = await prisma.user.findUnique({ where: { email: email } });

        if (user) {
            return res.send("A user with this email already exists.");
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const new_user = await prisma.user.create({
            data: {
                "email": email,
                "first_name": firstName,
                "last_name": lastName,
                "phone": phoneNumber,
                "password": hashed_password
            }
        });

        return res.send(200);
    } catch(err) {
        console.log("[auth] ", err);
        return res.send(`Failed to register user ${req.body}`);
    }
});

router.post("/login", async (req, res) => {
    const { error, value: body } = validators.login.validate(req.body);

    if (error) return res.send(error.details[0].message);

    req.body = body;

    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user || bcrypt.compareSync(user.password, password)) {
            return res.send("Wrong email or password.");
        }

        const payload = {id : user.id};
        const token = jwt.sign(payload, process.env.JWT_SECRET as string);
        const result = {
            "token": token,
            "user": user.email
        };

        return res.send(result);
    } catch(err) {
        console.log("[auth] ", err);
        return res.send("An error occurred.");
    }
});

export default router;