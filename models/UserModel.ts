import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    "firstName" : { type: String, required: true, trim: true},
    "lastName" : { type: String, required: true, trim: true},
    "username" : { type: String, required: true, trim: true, unique: true},
    "email" : { type: String, required: true, trim: true, unique: true},
    "password" : { type: String, required: true},
    "profilePicture" : { type: String, default: "/images/user.png" },
    'likes': [{ type: Schema.Types.ObjectId, ref: 'Post'}], //Creates array of Post objects
    'retweets': [{ type: Schema.Types.ObjectId, ref: 'Post'}],
    'following':  [{ type: Schema.Types.ObjectId, ref: 'User'}],
    'followers':  [{ type: Schema.Types.ObjectId, ref: 'User'}],
},{ timestamps: true });

export const USER: mongoose.Model<any> = mongoose.model("User", userSchema);