import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    "username": { type: String, required: true, trim: true, unique: true},
    "firstName": { type: String, required: true, trim: true},
    "lastName": { type: String, required: true, trim: true},
    "email": { type: String, required: true, trim: true, unique: true},
    "profilePicture" : { type: String, default: "/images/user.png" },
    "password" : { type: String, required: true},

},{ timestamps: true });

export const USER: any = mongoose.model("User", userSchema); 