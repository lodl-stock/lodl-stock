import {NextFunction, Response} from "express";
import axios from 'axios';

const checkValidUserWithRole = async (req: any, res: Response, next:NextFunction, isAdmin: boolean) => {
    try {
        // TODO: go through auth service to validate user role
        const instance = axios.create({
            baseURL: 'http://auth:5000/api/auth',
            timeout: 1000,
            headers: {'Authorization': req.headers.authorization}
        });

        const response = await instance.post("/check");
        if (isAdmin)
            if (response.data.admin !== true)
                throw new Error("user is not admin");
        return next();
    }
    catch(err) {
        console.log(err);
        return res.send("Unauthorized access");
    }
}

const clientMiddleware = (req: any, res: Response, next: NextFunction) => {
    checkValidUserWithRole(req, res, next, false);
};

const storeAdminMiddleware = (req: any, res: Response, next: NextFunction) => {
    checkValidUserWithRole(req, res, next, false);
}

const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
    checkValidUserWithRole(req, res, next, true);
}

export {clientMiddleware, storeAdminMiddleware, adminMiddleware}
