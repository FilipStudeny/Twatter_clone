import express, { NextFunction, Request, Response } from 'express'
import { post } from 'jquery';
import { requireLogin } from '../middleware/authentication'
import { CHAT } from '../models/ChatModel';
import { POST } from '../models/PostModel';
import { USER } from '../models/UserModel';

export const route = express.Router();

// *** FUNCTIONS *** //

// *** ROUTES *** //
route.get('/',  (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.status(200)
    return res.render('inbox', payload)
})

route.get('/new',  (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "New message",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.status(200)
    return res.render('newMessage', payload)
})

// *** chats *** ///

route.post('/chat', async (req: any, res: Response, next: NextFunction) => {


    if(!req.body.users){
        console.log("Users not send with chat request")
        return res.sendStatus(400);
    }

    let users = JSON.parse(req.body.users);
    console.log(users)

    if(users.length == 0){
        console.log("Users array is empty")
        return res.sendStatus(400);
    }

    users.push(req.session.user);

    const chatData = {
        'users': users,
        'isGroupchat': true,
    };

    CHAT.create(chatData)
    .then(results => {
        res.status(200).send(results);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

    return
})