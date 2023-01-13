import { NextFunction } from "express";

export const requireLogin = (req: any, res: any, next: NextFunction) => {

    if(req.session && req.session.user){
        return next(); //USER LOGGED IN SEND TO NEXT CONTROL
    }else{
        return res.redirect('/login');
    }

}