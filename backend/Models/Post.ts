import mongoose, { Schema, Document } from "mongoose";

interface Comment extends Document {
    comment: string;
    creator: mongoose.Schema.Types.ObjectId;
}

interface Post extends Document {
    post_content: string;
    post_creator: mongoose.Schema.Types.ObjectId;
    likes: mongoose.Schema.Types.ObjectId[];
    comments: Comment[];
}

export const commentSchema = new Schema<Comment>({
    comment: { type: String, trim: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
});

const postSchema = new Schema<Post>(
    {
        post_content: { type: String, trim: true },
        post_creator: { type: Schema.Types.ObjectId, ref: "User" },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        comments: [commentSchema],
    },{ timestamps: true }
);

export default Post;
export const PostModel = mongoose.model<Post>("Post", postSchema);
