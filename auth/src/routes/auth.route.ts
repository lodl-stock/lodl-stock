import {Router} from "express";
import * as bcrypt from 'bcrypt';
import prisma from "../prisma_client";
import validators from "../helpers/validators";
import jwt from "jsonwebtoken";
import { accessCount } from "../prometheus";

const router = Router();

router.post("/register", async (req, res) => {
    accessCount.inc();
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
                "password": hashed_password,
                "admin": false
            }
        });

        return res.status(200).json({ ...new_user, password: "" });
    } catch(err) {
        console.log("[auth] ", err);
        return res.send(`Failed to register user ${req.body}`);
    }
});

router.post("/login", async (req, res) => {
    accessCount.inc();
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

router.post("/check", async (req, res) => {
    accessCount.inc();
    if (!req.headers.authorization) {
        console.log("Token not found.");
        return res.status(403).json("Unauthorized access");
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const userId = (<any>decoded).id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json("The user making this request could not be found!");
        }

        // TODO: check user level
        return res.status(200).json({ ...user, password: "" });
    }
    catch {
        console.log("Token not valid. JWT failed.");
        return res.status(403).json("Unauthorized access");
    }
});

export default router;
