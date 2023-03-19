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

route.get("/allPosts", async (req:Request, res: Response, next: NextFunction) => {
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
        console.log(posts);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
})


route.get("/post/:id", async (req:Request, res: Response, next: NextFunction) => {

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
        post_body: decodeURIComponent(req.body.post_body),
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
  