import express, { Application, NextFunction, Request, Response} from 'express'
import * as dotenv from 'dotenv'
import { requireLogin} from './middleware/authentication';
import { route as userRoutes } from './routes/userRoutes';
import path from 'path';
import bodyParser from "body-parser";
import { Database } from './controllers/Database';

// *** CONFIG *** //
dotenv.config();

const PORT: any = process.env.PORT;
const app: Application = express();
const url: any = process.env.MONGO_URL;
const mongoDB = new Database(url);

// *** MIDDLEWARE AND STUFF *** //
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(bodyParser.json()); //NEEDS TO RECEIVE DATA IN JSON FORMAT 

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public'))) //CSS from public


// *** ROUTES *** //
app.use('/', userRoutes)

app.get('/', requireLogin, (req: Request, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Home page"
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
