import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({

    'content' : { type: String, trim: true},
    'postedBy' : { type: Schema.Types.ObjectId, ref: 'User'}, //takes ID from User 
    'pinnedPost' : Boolean,
    'likes': [{ type: Schema.Types.ObjectId, ref: 'User'}], //Creates array of User objects
    'retweetUsers': [{ type: Schema.Types.ObjectId, ref: 'User'}], //How many users have retweeted post
    'retweetData': { type: Schema.Types.ObjectId, ref: 'Post'}, //Post that is retweeted
    'replyTo': { type: Schema.Types.ObjectId, ref: 'Post'} //Post that is retweeted

},{ timestamps: true });

export const POST: mongoose.Model<any> = mongoose.model("Post", postSchema);