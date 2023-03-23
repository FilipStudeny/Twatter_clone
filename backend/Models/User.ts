import mongoose, { Schema, Document } from "mongoose";


interface User extends Document {
    'username': string,
    'firstName': string,
    'lastName': string,
    'email': string,
    'profilePicture': string,
    'password': string,
    'posts': mongoose.Types.ObjectId[],
    'comments': []
}

const userSchema = new Schema<User>({

    'username': { type: String, required: true, trim: true, unique: true },
    'firstName': { type: String, required: true, trim: true },
    'lastName': { type: String, required: true, trim: true },
    'email': { type: String, required: true, trim: true, unique: true },
    'profilePicture': { type: String, default: "/images/user.png" },
    'password': { type: String, required: true },
    'posts': [{ type: Schema.Types.ObjectId, ref: 'Post'}],
    'comments': [{ type: Schema.Types.ObjectId, ref: 'Comment'}]

},{ timestamps: true });

export default User;
export const UserModel = mongoose.model<User>("User", userSchema);
