import mongoose, { Schema, Document } from "mongoose";

export interface Comment extends Document {
    comment: string;
    creator: mongoose.Schema.Types.ObjectId;
}

export const commentSchema = new Schema<Comment>({
    comment: { type: String, trim: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
});

export default Comment;
export const CommentModel = mongoose.model<Comment>("Comment", commentSchema);
