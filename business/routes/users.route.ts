import {Router} from "express";

const router = Router();

router.get('/', async (req : any, res) => {
    res.send("hello");
});

export default router;