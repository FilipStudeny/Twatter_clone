import express, { NextFunction, Request, Response } from 'express'
import { requireLogin } from '../middleware/authentication'

export const route = express.Router();


// *** ROUTES *** //
route.get('/',  (req: Request, res: Response, next: NextFunction) => {
    const payload: Object = {
        pageTitle : "Login page"
    }


    res.status(200)
    res.render('login', payload)
})

