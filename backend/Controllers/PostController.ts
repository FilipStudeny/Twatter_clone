import express, { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { Jwt } from "jsonwebtoken";
import { authorization } from "../Middleware/authorization";
import Post, { PostModel } from "../Models/Post";
import User, { UserModel } from "../Models/User";

declare global {
    namespace Express {
        interface Request {
            decodedToken?: any
        }
    }
}

export const route = express.Router();

// *** ROUTES *** //
route.use(authorization);

route.get("/allPosts", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await PostModel.find()
            .populate({ 
                path: "post_creator", 
                select: "username _id" 
                })
            .sort({
                "createdAt":-1 //Descending order
            });

        res.status(200).send(posts);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
})
  

route.get("/post/:id", async (req:Request, res: Response, next: NextFunction) => {

    const postID: string = req.params.id;

    if(!postID || postID == undefined || postID == ""){
        return res.status(400).send({ error: "Bad Request: New Post data not sent, try again!" });
    }

    try {
        const post = await PostModel.findById(postID)
        .populate({
            path: "post_creator", 
            select: "username _id" 
            })
        .sort({
            "createdAt":-1 //Descending order
        });

        return res.status(200).send(post);
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Bad Request: Post can't be loaded!" });
    }
})



route.post("/new", async (req: Request, res: Response, next: NextFunction) => {

    interface RequestData {
        token: {
            user_id: string;
            username: string;
            email: string;
            iat: number;
        };
        post_body: string;
    }
  
    const postData: RequestData = {
        token: req.decodedToken,
        post_body: req.body.post_body,
    };
  
    if (!postData || !(postData.token && postData.post_body)) {
        return res.status(400).send({ error: "Bad Request: New Post data not sent, try again!" });
    }
  
    try {
        // Create a new Post
        const newPost: Post = await PostModel.create({
            post_content: postData.post_body,
            post_creator: postData.token.user_id,
        });
    
        // Update the user's posts array with the new Post ID
        const updatedUser = await UserModel.findByIdAndUpdate(
            postData.token.user_id,
            { $push: { posts: newPost._id } },
            { new: true }
        );
    
        // Populate the new Post with the post creator
        const populatedPost = await PostModel.populate(newPost, {
            path: "post_creator",
        });
    
        return res.status(201).send(populatedPost);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Bad Request: Post can't be created!" });
    }
});
  
route.post("/:id/newComment", async (req: Request, res: Response, next: NextFunction) => {
    interface RequestData {
        token: {
            user_id: string;
            username: string;
            email: string;
            iat: number;
        };
        comment: string,
        postID: string
    }

    const requestData: RequestData = {
        token: req.decodedToken,
        comment: req.body.newComment,
        postID: req.params.id
    };

    interface Comment{
        comment: string,
        creator: string,
    }

    let newComment: Comment = {
        comment: requestData.comment,
        creator: requestData.token.user_id
    }

    try {
        // Update the user's posts array with the new Post ID
        const updatedPost = await PostModel.findByIdAndUpdate(
            requestData.postID,
            { $push: { comments: newComment } },
            { new: true }
        ).sort({
            "createdAt":-1 //Descending order
        });;

        //GET NEWEST COMMENT
        const newestComment: any = updatedPost?.comments.pop();
        const userCommentData = {
            postID: requestData.postID,
            commentID: newestComment?._id
        }

        //UPDATE USER COMMENT WITH COMMENT ID AND POST ID
        await UserModel.findByIdAndUpdate(
            requestData.token.user_id,
            { $push: { comments: userCommentData } },
            { new: true }
        );

        return res.status(200).json(newestComment)
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Bad Request: Comment can't be created!" });
    }
    
});