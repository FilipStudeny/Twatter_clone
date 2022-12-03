import express, { NextFunction, Request, Response } from 'express'
import { post } from 'jquery';
import mongoose from 'mongoose';
import { requireLogin } from '../middleware/authentication'
import { CHAT } from '../models/ChatModel';
import { MESSAGE } from '../models/MessageModel';
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
route.get('/chat', async (req: any, res: Response, next: NextFunction) => {
    await CHAT.find({ 
        'users' : {
            $elemMatch: {
                $eq: req.session.user._id,
            }
        }
    })
    .populate('users')
    .populate('latestMessage')
    .sort({ 'updatedAt': -1 })
    .then( async results => {
        results = await USER.populate(results, { path: 'latestMessage.sender'});
        res.status(200).send(results);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });
})

route.get('/chat/:chatID', async (req: any, res: Response, next: NextFunction) => {

    const userID = req.session.user._id;
    const chatID = req.params.chatID;
    const isValidID = mongoose.isValidObjectId(chatID);

    let payload: any = {
        pageTitle : "Chat",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        
    }

    if(!isValidID){
        payload.errorMessage = "Chat does not exist or you do not have the permission to display it"
        res.status(200)
        return res.render('chatPage', payload)
    }

    let chat = await CHAT.findOne({ '_id': chatID, 'users': { '$elemMatch': { '$eq': userID}}})
    .populate('users')
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

    if(chat == null){
        //check if chat ID is userID
        const userFound = await USER.findById(chatID);

        if(userFound != null){
            //Get chat using user ID
            chat = await getChatByUserID(userFound._id, userID);
        }
    }

    if(chat == null){
        payload.errorMessage = "Chat does not exist or you do not have the permission to display it"
    }else{
        payload.chat = chat;
    }



    res.status(200)
    return res.render('chatPage', payload)
})

route.put('/chat/:chatID', async (req: any, res: Response, next: NextFunction) => {

    await CHAT.findByIdAndUpdate( req.params.chatID, req.body)
    .then( _ => {
        res.sendStatus(204);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

})

route.get('/chats/:chatID', async (req: any, res: Response, next: NextFunction) => {

    await CHAT.findOne({ '_id': req.params.chatID, 'users': { '$elemMatch': { '$eq': req.session.user._id}}})
    .populate('users')
    .then( results => {
        res.status(200).send(results);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

})

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

route.post('/chat/newMessage', async (req: any, res: Response, next: NextFunction) => {

    if(!req.body.content || !req.body.chatID){
        console.log("Invalid Data passed into request")
        return res.sendStatus(400);
    }

    let newMessage = {
        'sender': req.session.user._id,
        'content': req.body.content,
        'chat': req.body.chatID
    }

    MESSAGE.create(newMessage)
    .then(async results => {
        results = await results.populate(['sender']);
        results = await results.populate(['chat']);

        CHAT.findByIdAndUpdate(req.body.chatID, { 'latestMessage' : results})
        .catch((err) => {
            console.log(err);
        });

        res.status(201).send(results);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

    return
})

route.get('/chats/:chatID/messages', async (req: any, res: Response, next: NextFunction) => {

    await MESSAGE.find({ 'chat': req.params.chatID })
    .populate('sender')
    .then( results => {
        res.status(200).send(results);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

})


const getChatByUserID = (usserLoggedInID: any, otherUserID: any) => {

    return CHAT.findOneAndUpdate({
        'isGroupChat': false,
        'users': {
            '$size': 2,
            '$all': [
                {$elemMatch: {'$eq': new mongoose.Types.ObjectId(usserLoggedInID)}},
                {$elemMatch: {'$eq': new mongoose.Types.ObjectId(otherUserID)}}
            ]
        }
    },{
        $setOnInsert: {
            'users': [usserLoggedInID, otherUserID]
        }
    },{
        new: true,
        upsert: true //If didn't find it create it
    })
    .populate('users');
}