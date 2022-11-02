import express, { NextFunction, Request, Response } from 'express'
import { requireLogin } from '../middleware/authentication'
import { USER } from '../models/UserModel';
import bcrypt from 'bcrypt';

export const route = express.Router();


// *** ROUTES *** //
route.get('/login',  (req: Request, res: Response, next: NextFunction) => {
    const payload: Object = {
        pageTitle : "Login page"
    }


    res.status(200)
    res.render('login', payload)
})

route.post('/login', async (req: any, res: Response, next: NextFunction) => {

    // *** USER DATA *** //
    const password = req.body.logPassword.trim();
    const username = req.body.logUsername;

    const payload = req.body;

    if (username && password){
        const user = await USER.findOne({
            $or: [ //FIND USER BY STUFF FROM ARRAY 
                { username: username },
                { email: username }
            ]
        })
        .catch((err) => {
            console.log(err);
            payload.errorMessage = "Something went wrong !"
            res.status(200).render('login', payload)
        })

        if( user ){
            const result = await bcrypt.compare(password, user.password);

            if( result ){
                req.session.user = user;
                return res.redirect("/");            
            }
        }

        payload.errorMessage = "Loggin credentials incorect !"
        res.status(200).render('login', payload)
    }

    payload.errorMessage = "Make sure each field has valid value !"
    res.status(200).render('login', payload)

})

route.get('/register',  (req: Request, res: Response, next: NextFunction) => {
    const payload: Object = {
        pageTitle : "Register page"
    }


    res.status(200)
    res.render('register', payload)
})

route.post('/register',  async (req: any, res: Response, next: NextFunction) => {

    // *** USER DATA *** //
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    const username = req.body.username;

    const payload = req.body;


    if(firstName && lastName && password && email && username){

        const user = await USER.findOne({
            $or: [ //FIND USER BY STUFF FROM ARRAY 
                { username: username },
                { email: email }
            ]
        })
        .catch((err) => {
            console.log(err);
            payload.errorMessage = "Something went wrong !"
            res.status(200).render('register', payload)
        })

        if( user ){
            if(email == user.email){
                payload.errorMessage = "Email already in user !"
            }else{
                payload.errorMessage = "Username already in use !"
            }
            res.status(200).render('register', payload)
        }else{

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new USER({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: hashedPassword,
            });

            try {
                await newUser.save();
                req.session.user = newUser;
                return res.redirect("/");

            } catch (err) {
                console.log(err);
                payload.errorMessage = "Something went wrong !"
                res.status(200).render('register', payload)
            }
        }

    }else{
        payload.errorMessage = "Form fields are empty"
        res.status(200).render('register', payload)
    }

})


