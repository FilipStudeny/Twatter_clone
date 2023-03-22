import express, { NextFunction, Request, Response } from 'express'
import { requireLogin } from '../middleware/authentication'
import { inserNotification } from '../models/NotificationModel';
import { POST } from '../models/PostModel';
import { USER } from '../models/UserModel';

export const route = express.Router();

// *** FUNCTIONS *** //
const getPosts = async (filter?: any) => {
    var results = await POST.find(filter)
        .populate("postedBy")
        .populate("retweetData")
        .populate("replyTo")
        .sort({
            "createdAt":-1 //Descending order
        })
        .catch( (err) => {
            console.log(err);
        })

    results = await USER.populate(results, { path: 'replyTo.postedBy' });
    return await USER.populate(results, { path: 'retweetData.postedBy' });

}

// *** ROUTES *** //
route.get('/',  async (req: any, res: Response, next: NextFunction) => {

    let searchForPosts = req.query;

    if(searchForPosts.isReply !== undefined){
        const isReply = searchForPosts.isReply == 'true';
        searchForPosts.replyTo = { $exists: isReply }
        delete searchForPosts.isReply;
    }

    if(searchForPosts.search !== undefined){
        searchForPosts.content = { $regex: searchForPosts.search, $options: 'i' }
        delete searchForPosts.search;
    }

    //GET POSTS FROM USER YOU FOLLOW
    if(searchForPosts.followingOnly !== undefined){
        const followingOnly = searchForPosts.followingOnly == 'true';

        if(followingOnly){
            let objectIDs = [];

            if(!req.session.user.following){
                req.session.user.following = [];
            }
            
            req.session.user.following.forEach((user: any) => {
                objectIDs.push(user)
            })

            objectIDs.push(req.session.user._id); //SHOWS OUR OWN POSTS ON HOME PAGE
    
            searchForPosts.postedBy = { $in: objectIDs }
        }
        
        delete searchForPosts.followingOnly;
    }
    
    let results = await getPosts(searchForPosts);
    return res.status(200).send(results);
})

route.get('/:id',  async (req: any, res: Response, next: NextFunction) => {

    let postID = req.params.id;
    let postData = await getPosts({_id: postID});
    postData = postData[0];

    interface Result{
        postData: any,
        replyTo?: any,
        replies?: any
    }

    let results: Result = {
        postData: postData
    };


    if(postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({ replyTo: postID });
    res.status(200).send(results);

})

route.get('/post/:id',  async (req: any, res: Response, next: NextFunction) => {
    const payload: Object = {
        pageTitle : "Post page",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        postID: req.params.id
    }

    res.status(200)
    return res.render('post', payload)

})

route.post('/new', async (req: any, res: Response) => {

    if(!req.body.content){
        console.log("Content not send with request");
        return res.status(400);
    }

    let newPost = new POST({
        content: req.body.content,
        postedBy: req.session.user
    })

    if(req.body.replyTo){
        newPost.replyTo = req.body.replyTo;
    }

    POST.create(newPost)
    .then(async (newPost) => {
        newPost = await USER.populate(newPost, { path: 'postedBy'})
        newPost = await POST.populate(newPost, { path: 'replyTo'})

        if(newPost.replyTo !== undefined){
            await inserNotification(newPost.replyTo, req.session.user._id, "Reply", newPost.postedBy)
        }

        res.status(201).send(newPost);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Error, something went wrong !')
    })

    return
    /*
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
    */
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

    if(!isLiked){
        await inserNotification(post.postedBy, req.session.user._id, "Post like", post._id)
    }

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

    if (repost === null){
        repost = await POST.create({ 'postedBy': userID, 'retweetData': postID })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }


    //POST RETWEET
    req.session.user = await USER.findByIdAndUpdate(userID, { [option]: { 'retweets': postID } }, { new: true}) //returns updated likes array into session
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

    if(!deletedPost){
        await inserNotification(post.postedBy, req.session.user._id, "Retweet", post._id)
    }

    res.status(200).send(post);

})

route.delete('/delete/:id',  async (req: any, res: Response, next: NextFunction) => {
    POST.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch((err) => {
        console.log(err);
        res.sendStatus(400);
    })
})

route.put('/pin/:id',  async (req: any, res: Response, next: NextFunction) => {

    if(req.body.pinned !== undefined){
        await POST.updateMany({ 'postedBy' : req.session.user }, { 'pinned': false })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        })
    }

    POST.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    .catch((err) => {
        console.log(err);
        res.sendStatus(400);
    })
})

