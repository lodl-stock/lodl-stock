import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import constants from "../constants";
import {User} from "../models";
import createDartMessage from "../helpers/createDartMessage";
import Config from "../models/config.model";

const checkValidUserWithRole = async (req: any, res: Response, next:NextFunction, roleLevel: number) => {
    if (!req.headers.authorization) {
        console.log("Token not found.");
        return res.send(createDartMessage("Unauthorized access"));
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const userID = (<any>decoded).id;

        const user = await User.findById(userID);
        if (!user) {
            return res.send(createDartMessage("The user making this request could not be found!"));
        }

        const userLevel : number = constants.roles[user.role]
        if (userLevel && userLevel >= roleLevel) {
            req.user = user;
            return next();
        }

        return res.send(createDartMessage("Unauthorized access"));
    }
    catch {
        console.log("Token not valid. JWT failed.");
        return res.send(createDartMessage("Unauthorized access"));
    }
}

const competitorMiddleware = (req:any, res:Response, next:NextFunction) =>{
    checkValidUserWithRole(req, res, next, constants.roles.COMPETITOR)
};

const adminMiddleware = (req:any, res:Response, next:NextFunction)=>{
    checkValidUserWithRole(req, res, next, constants.roles.ADMIN);
}

const volunteerMiddleware = (req:any, res:Response, next:NextFunction)=>{
    checkValidUserWithRole(req, res, next, constants.roles.VOLUNTEER);
}

const timeMiddleware = async (req:any, res:Response, next:NextFunction)=>{
    const user = req.user;

    // show admins everything, all the time
    if (user.role === "ADMIN") {
        req.showRiddles = true;
        req.ongoing = true;

        return next();
    }

    const config = await Config.findOne({});

    // if not config, put it all on pause and alert
    if (!config) {
        console.log("FAILED TO FIND CONFIG !!! INVESTIGATE IMMEDIATELY");

        req.showRiddles = false;
        req.ongoing = false;

        return next();
    }

    // take vars out of config
    req.showRiddles = config.showRiddles;
    req.ongoing = config.ongoing;

    return next();
}

export {competitorMiddleware, adminMiddleware, volunteerMiddleware, timeMiddleware}
