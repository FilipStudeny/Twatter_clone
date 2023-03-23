import mongoose, { Schema, Document } from "mongoose";
import { commentSchema } from "./Comment";


interface Post extends Document {
    'post_content': string;
    'post_creator': mongoose.Schema.Types.ObjectId;
    'likes': mongoose.Schema.Types.ObjectId[];
    'comments': mongoose.Schema.Types.ObjectId[];
}


const postSchema = new Schema<Post>(
    {
        'post_content': { type: String, trim: true },
        'post_creator': { type: Schema.Types.ObjectId, ref: "User" },
        'likes': [{ type: Schema.Types.ObjectId, ref: "User" }],
        'comments': [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
    },{ timestamps: true }
);

export default Post;
export const PostModel = mongoose.model<Post>("Post", postSchema);
