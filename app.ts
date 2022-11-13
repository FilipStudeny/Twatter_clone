import express, { Application, NextFunction, Request, Response} from 'express'
import * as dotenv from 'dotenv'
import { requireLogin} from './middleware/authentication';
import { route as userRoutes } from './routes/userRoutes';
import { route as postRoutes } from './routes/postsRoutes';

import path from 'path';
import bodyParser from "body-parser";
import { Database } from './controllers/Database';
import session from 'express-session';


// *** CONFIG *** //
dotenv.config();

const PORT: any = 8888;
const app: Application = express();
const url: any = process.env.MONGO_URL;
const mongoDB = new Database(url);

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
app.use('/', userRoutes)
app.use('/posts/', postRoutes)

app.get('/', requireLogin, (req: any, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Home page",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.status(200)
    res.render('home', payload)

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

//*** BEEP BOOP ***//
app.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})
