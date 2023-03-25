import express, { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { Jwt } from "jsonwebtoken";
import { authorization } from "../Middleware/authorization";
import Post, { PostModel } from "../Models/Post";
import User, { UserModel } from "../Models/User";
import { CommentModel } from "../Models/Comment";

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

    let filter: any = {}
    if(req.query.userID){
        filter = { 
            'post_creator': req.query.userID
        }
    }

    try {
        const posts = await PostModel.find(filter)
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
        .populate({
            path: "comments",
            populate: {
                path: "creator",
                select: "username _id"
            }
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

route.delete("/:id/delete", async (req:Request, res: Response, next: NextFunction) => {

    const postID: string = req.params.id;

    if(!postID || postID == undefined || postID == ""){
        return res.status(400).send({ error: "Bad Request: Post ID not sent, try again!" });
    }

    try {
        // Find the post to delete
        const post: any = await PostModel.findById(postID).populate('comments');
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        // Delete all associated comments
        await Promise.all(post.comments.map(async (comment:any) => {

            // Remove the comment from the User's comments array
            await UserModel.findByIdAndUpdate(comment.creator, { $pull: { comments: comment._id }});
            // Delete the comment
            await CommentModel.findByIdAndDelete(comment._id);
        }));

        // Remove the Post ID from the User's posts array
        await UserModel.findByIdAndUpdate(post.post_creator._id, { $pull: { posts: post._id } });

        // Delete the post
        await post.delete();
        return res.sendStatus(200);

    }catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
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
  
route.get("/:id/allComments", async (req: Request, res: Response, next: NextFunction) => {

    const userID: any = req.params.id

    try {

        const user = await UserModel.findById(userID)
        .populate('comments')
        .sort({
            "createdAt":-1 //Descending order
        });

        const userComments = user?.comments;
        console.log(userComments)
        return res.status(200).json(userComments)
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Bad Request: Comments can't be loaded !" });
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

    interface Comment{
        comment: string,
        creator: string,
        post_id: string
    }

    const requestData: RequestData = {
        token: req.decodedToken,
        comment: req.body.newComment,
        postID: req.params.id
    };

    const comment: Comment = {
        comment: requestData.comment,
        creator: requestData.token.user_id,
        post_id: requestData.postID
    }

    try {

        const newComment = await CommentModel.create(comment);
        await UserModel.findByIdAndUpdate(requestData.token.user_id, { $push: { comments: newComment._id } });
        await PostModel.findByIdAndUpdate(requestData.postID, { $push: { comments: newComment._id } });
        await newComment.populate("creator", "username _id");

        return res.status(200).json(newComment)
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Bad Request: Comment can't be created!" });
    }
    
});



route.delete("/:id/comment/:comment_id", async (req: Request, res: Response, next: NextFunction) => {

    const postID = req.params.id;
    const commentID = req.params.comment_id;

    try {
        // Find the comment to delete
        const comment: any = await CommentModel.findById(commentID);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Remove comment from User model
        const user = await UserModel.findByIdAndUpdate(
            comment.creator,
            { $pull: { comments: commentID } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove comment from Post model
        const post = await PostModel.findByIdAndUpdate(
            postID,
            { $pull: { comments: commentID } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove the comment from the Comment model
        await CommentModel.findByIdAndDelete(commentID);
        return res.status(200).json({ message: "Comment deleted successfully" });
    }catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }

});