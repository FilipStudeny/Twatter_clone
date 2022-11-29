import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    'chatName' : { type: String, trim: true},
    'isGroupChat' : { type: Boolean, default: false},
    'users' : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    'latestMessage' : [{ type: Schema.Types.ObjectId, ref: 'Message'}],
    
},{ timestamps: true });

export const CHAT: mongoose.Model<any> = mongoose.model("Chat", chatSchema);