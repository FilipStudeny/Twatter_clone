import express, { NextFunction, Request, Response } from 'express'
import { requireLogin } from '../middleware/authentication'
import { POST } from '../models/PostModel';
import { USER } from '../models/UserModel';

export const route = express.Router();


// *** ROUTES *** //
route.get('/',  async (req: any, res: Response, next: NextFunction) => {
    
    POST.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({
        "createdAt":-1 //Descending order
    })
    .then( async (results) => {
        results = await USER.populate(results, { path: 'retweetData.postedBy' });
        res.status(200).send(results)
    })
    .catch( (err) => {
        console.log(err);
        res.status(400);
    })

})


route.post('/new', async (req: any, res: Response, next: NextFunction) => {

    if(!req.body.content){
        console.log("Contontent not send with request");
        res.status(400).send("Contontent not send with request");
        return;
    }

    const content = req.body.content;
    const postedBy = req.session.user;

    const newPost = new POST({
        content: content,
        postedBy: postedBy
    })

    try {
        await newPost.save();
        await USER.populate(newPost, {
            path: "postedBy"
        })
        return res.status(201).send(newPost);
       

    } catch (err) {
        console.log(err);
        return res.status(400).send('Error, something went wrong !')
    }

})

route.put('/:id/like',  async (req: any, res: Response, next: NextFunction) => {

    const postID = req.params.id;
    const userID = req.session.user._id;
    const isLiked = req.session.user.likes && req.session.user.likes.includes(postID);

    const option = isLiked ? '$pull' : '$addToSet';

    //USER LIKES
    req.session.user = await USER.findByIdAndUpdate(userID, { [option]: { 'likes': postID } }, { new: true}) //returns updated likes array into session
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })
    
    //POST LIKES
    const post = await POST.findByIdAndUpdate(postID, { [option]: { 'likes': userID } }, { new: true}) //returns updated likes array 
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

    res.status(200).send(post);

})

route.post('/:id/retweet',  async (req: any, res: Response, next: NextFunction) => {

    const postID = req.params.id;
    const userID = req.session.user._id;

    //Try and delete retweet
    const deletedPost = await POST.findOneAndDelete({ 'postedBy': userID, 'retweetData': postID })
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

    const option = deletedPost != null ? '$pull' : '$addToSet';
    let repost = deletedPost;

    if (repost == null){
        repost = await POST.create({ 'postedBy': userID, 'retweetData': postID })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }

    //POST RETWEET
    req.session.user = await USER.findByIdAndUpdate(userID, { [option]: { 'retweets': repost.id } }, { new: true}) //returns updated likes array into session
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

    //USER LIKES
    req.session.user = await USER.findByIdAndUpdate(userID, { [option]: { 'likes': postID } }, { new: true}) //returns updated likes array into session
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })
    
    //POST user retweets
    const post = await POST.findByIdAndUpdate(postID, { [option]: { 'retweetUsers': userID } }, { new: true}) //returns updated likes array 
    .catch( (err) => {
        console.log(err);
        res.sendStatus(400);
    })

    res.status(200).send(post);

})

route.post('/delete',  async (req: any, res: Response, next: NextFunction) => {

})


