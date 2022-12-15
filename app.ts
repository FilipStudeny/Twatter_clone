import express, { Application, NextFunction, Request, Response} from 'express'
import * as dotenv from 'dotenv'
import { requireLogin} from './middleware/authentication';
import { route as userRoutes } from './routes/userRoutes';
import { route as postRoutes } from './routes/postsRoutes';
import { route as chatRoutes } from './routes/chatRoutes'
import { route as notificationsRoutes } from './routes/notificationsRoutes';

import path from 'path';
import bodyParser from "body-parser";
import { Database } from './controllers/Database';
import session from 'express-session';

import { Server, Socket } from 'socket.io';
import { createServer }  from 'http';


// *** CONFIG *** //
dotenv.config();

const PORT: any = 8888;
const app = express();
const url: any = process.env.MONGO_URL;
const mongoDB = new Database(url);
const chatServer = createServer(app);
const socketIO = require('socket.io')(chatServer);


// *** MIDDLEWARE AND STUFF *** //
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ //EXPRESS sessions
    secret: "beepboop", //hash
    resave: true, //session forced to save
    saveUninitialized: false //prevents session from being saved as uninitiblabla
}))

//app.use(bodyParser.json()); //NEEDS TO RECEIVE DATA IN JSON FORMAT 

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public'))) //CSS from public


// *** ROUTES *** //
app.use('/',  userRoutes)
app.use('/posts/', requireLogin, postRoutes)
app.use('/messages/', requireLogin, chatRoutes)
app.use('/notifications/', requireLogin, notificationsRoutes)

app.get('/', requireLogin, (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Home page",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.status(200)
    res.render('home', payload)
})

app.get('/search', requireLogin, (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Search",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.status(200)
    res.render('search', payload)
})

app.get('/search/:selectedTab', requireLogin, (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Search",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        selectedTab: req.params.selectedTab
    }

    res.status(200)
    res.render('search', payload)
})

//*** 404 ***//
app.all('*', (req: Request, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Home page"
    }

    res.status(404)
    res.render('404', payload)
})


// *** MONGO *** //
mongoDB.connect();

// *** SOCKET IO *** //
socketIO.on("connection", (client: Socket) => {

    client.on("setup", (userData: any) => { //"setup" <= user defined name / use is joining chat room
        client.join(userData._id);
        client.emit("connected");
    });

    client.on("join room", (room: any) => { 
        client.join(room);  //User joins a room
    });

    client.on("typing", (room: any) => { 
        client.in(room).emit("typing") //Anyone in this room will receive notification
    });

    client.on("stop typing", (room: any) => { 
        client.in(room).emit("stop typing") //Anyone in this room will receive notification
    });

    client.on("new message", (newMessage: any) => { //RELOAD CHAT WHEN NEW MESSAGE ARRIVES
        const chat = newMessage.chat;

        if(!chat.users){
            return console.log("Chat.users not defined");
        }

        chat.users.forEach((user: any) => {

            if(user._id == newMessage.sender._id){
                return;
            }

            client.in(user._id).emit("message received", newMessage); 
        });
    });
    
})


//*** BEEP BOOP ***//
chatServer.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})

