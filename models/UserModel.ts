import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    "firstName" : { type: String, required: true, trim: true},
    "lastName" : { type: String, required: true, trim: true},
    "username" : { type: String, required: true, trim: true, unique: true},
    "email" : { type: String, required: true, trim: true, unique: true},
    "password" : { type: String, required: true},
    "profilePicture" : { type: String, default: "/img/user.png" }

},{ timestamps: true });

export const USER: mongoose.Model<any> = mongoose.model("User", userSchema);