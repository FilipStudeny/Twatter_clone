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
    }else{
        payload.errorMessage = "Make sure each field has valid value !"
        res.status(200).render('login', payload)
    }

    

})

route.get('/logout',  async (req: any, res: Response, next: NextFunction) => {

    if(req.session){
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }

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

route.get('/profile/', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : '@' + req.session.user.username + " profile page",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        profileID: req.session.user.username
    }

    res.status(200)
    return res.render('profile', payload)
})

route.get('/profile/:username', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    const payload: Object = await getPayload(req.params.username, req, req.session.user)

    res.status(200)
    return res.render('profile', payload)

})

route.get('/profile/:username/replies', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    interface Result{
        pageTitle: string;
        userLoggedIn: any;
        userLoggedInJS: string;
        profileUser?: undefined;
        selectedTab?: any
    }

    let payload: Result = await getPayload(req.params.username, req, req.session.user)
    payload.selectedTab = "replies";

    res.status(200)
    return res.render('profile', payload)

})

route.get('/profile/:username/followers', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    interface Result{
        pageTitle: string;
        userLoggedIn: any;
        userLoggedInJS: string;
        profileUser?: undefined;
        selectedTab?: any
    }

    let payload: Result = await getPayload(req.params.username, req, req.session.user)
    payload.selectedTab = "followers";

    res.status(200)
    return res.render('followers', payload)
})

route.get('/profile/:username/following', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    interface Result{
        pageTitle: string;
        userLoggedIn: any;
        userLoggedInJS: string;
        profileUser?: undefined;
        selectedTab?: any
    }

    let payload: Result = await getPayload(req.params.username, req, req.session.user)
    payload.selectedTab = "following";

    res.status(200)
    return res.render('followers', payload)

})

route.get('/user/:userID/following', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    const userID = req.params.userID;
    USER.findById(userID)
    .populate('following')
    .then( (results) => {
        res.status(200).send(results);
    }).catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

})

route.get('/user/:userID/followers', requireLogin ,async (req: any, res: Response, next: NextFunction) => {

    const userID = req.params.userID;
    USER.findById(userID)
    .populate('followers')
    .then( (results) => {
        res.status(200).send(results);
    }).catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

})

route.put('/users/:userID/follow',  async (req: any, res: Response, next: NextFunction) => {

    const userID = req.params.userID;

    const user = await USER.findById(userID)

    if (user == null){
        return res.sendStatus(404);
    }

    const isFollowing = user.followers && user.followers.includes(req.session.user._id);
    const option = isFollowing ? '$pull' : '$addToSet';

    req.session.user = await USER.findByIdAndUpdate(req.session.user._id, { [option]: { 'following': userID } }, { new: true}) //returns updated likes array into session
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

    USER.findByIdAndUpdate(userID, { [option]: { 'followers': req.session.user._id } }) 
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

    return res.status(200).send(req.session.user);
})

const getPayload = async (username: any, req: any, userLoggedIn: any) => {
    let user = await USER.findOne({username: username})

    if(user == null){
        user = await USER.findById(username)

        if(user == null){
            return {
                pageTitle : 'User not found',
                userLoggedIn: req.session.user,
                userLoggedInJS: JSON.stringify(userLoggedIn),
            }
        }
    }

    return {
        pageTitle : '@' + user.username + ' profile page',
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}