import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose';
import { requireLogin } from '../middleware/authentication'
import { NOTIFICATION } from '../models/NotificationModel';


export const route = express.Router();

// *** FUNCTIONS *** //

// *** ROUTES *** //
route.get('/',  (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Notifications",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.status(200)
    return res.render('notifications', payload)
})

route.get('/all',  (req: any, res: Response, next: NextFunction) => {

    interface Data {
        'userTo' : any,
        'opened'? : Boolean,
        'notificationType' : Object
    }

    let searchObj: Data = { 'userTo' : req.session.user._id, 'notificationType' : { $ne : 'New message'} }

    if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true"){
        searchObj.opened = false;
    };



    NOTIFICATION.find(searchObj)
    .populate('userTo')
    .populate('userFrom')
    .sort( { 'createdAt': -1})
    .then( (results) => {
        res.status(200).send(results);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Error, something went wrong !')
    });
})

route.put('/:id/markAsOpened',  (req: any, res: Response, next: NextFunction) => {

    NOTIFICATION.findByIdAndUpdate(req.params.id, { opened: true })
    .then( () => {
        res.sendStatus(204);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Error, something went wrong !')
    });
})

route.put('/markAsOpened',  (req: any, res: Response, next: NextFunction) => {

    NOTIFICATION.updateMany({ 'userTo' : req.session.user._id }, { opened: true })
    .then( () => {
        res.sendStatus(204);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Error, something went wrong !')
    });
})

