import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    'userTo' : { type: Schema.Types.ObjectId, ref: 'User'},
    'userFrom' : { type: Schema.Types.ObjectId, ref: 'User'},
    'notificationType' : String,
    'opened' : { type: Boolean, default: false },
    'entityID' : Schema.Types.ObjectId, //LINK TO NOTIFICATION - REPLY, LIKE, RETWEET
},{ timestamps: true });

export const inserNotification = async (userTo: any, userFrom: any, notificationType: String, entityID: any) => {
    const data: any = {
        'userTo' : userTo,
        'userFrom' : userFrom,
        'notificationType' : notificationType,
        'entityID' : entityID
    };

    await NOTIFICATION.deleteOne(data)
    .catch(err => 
        console.log(err));

    NOTIFICATION.create(data).catch(err => 
        console.log(err));
}

export const NOTIFICATION: mongoose.Model<any> = mongoose.model("Notifiaction", notificationSchema);