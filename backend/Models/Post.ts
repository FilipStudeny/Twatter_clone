import mongoose, { Schema, Document } from "mongoose";

interface Reply extends Document {
    reply_content: string;
    reply_creator: mongoose.Schema.Types.ObjectId;
}

interface Post extends Document {
    post_content: string;
    post_creator: mongoose.Schema.Types.ObjectId;
    likes: mongoose.Schema.Types.ObjectId[];
    replies: Reply[];
}

const replySchema = new Schema<Reply>({
    reply_content: { type: String, trim: true },
    reply_creator: { type: Schema.Types.ObjectId, ref: "User" },
});

const postSchema = new Schema<Post>(
    {
        post_content: { type: String, trim: true },
        post_creator: { type: Schema.Types.ObjectId, ref: "User" },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        replies: [replySchema],
    },{ timestamps: true }
);

export default Post;
export const PostModel = mongoose.model<Post>("Post", postSchema);
