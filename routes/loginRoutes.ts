import express, { NextFunction, Request, Response } from 'express'
import { requireLogin } from '../middleware/authentication'

export const route = express.Router();


// *** ROUTES *** //
route.get('/login',  (req: Request, res: Response, next: NextFunction) => {
    const payload: Object = {
        pageTitle : "Login page"
    }


    res.status(200)
    res.render('login', payload)
})

route.get('/register',  (req: Request, res: Response, next: NextFunction) => {
    const payload: Object = {
        pageTitle : "Register page"
    }


    res.status(200)
    res.render('register', payload)
})

route.post('/register',  (req: Request, res: Response, next: NextFunction) => {

    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    const username = req.body.username;

    const payload = req.body;

    if(firstName && lastName && password && email && username){
        
    }else{
        payload.errorMessage = "Form fields are empty"
        res.status(200).render('register', payload)
    }

})


