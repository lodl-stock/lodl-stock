import {NextFunction, Response} from "express";

const checkValidUserWithRole = async (req: any, res: Response, next:NextFunction, roleLevel: number) => {
    try {
        // TODO: go through auth service to validate user role
        return next();
    }
    catch {
        return res.send("Unauthorized access");
    }
}

const clientMiddleware = (req: any, res: Response, next: NextFunction) =>{
    checkValidUserWithRole(req, res, next, 0)
};

const storeAdminMiddleware = (req: any, res: Response, next: NextFunction) => {
    checkValidUserWithRole(req, res, next, 0);
}

const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
    checkValidUserWithRole(req, res, next, 0);
}

export {clientMiddleware, storeAdminMiddleware, adminMiddleware}
