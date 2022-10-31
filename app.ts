import express, { Application, NextFunction, Request, Response} from 'express'
import * as dotenv from 'dotenv'
import { requireLogin} from './middleware/authentication';
import { route as loginRoutes } from './routes/loginRoutes';
import path from 'path';
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from 'mongoose';

// *** CONFIG *** //
dotenv.config();

const PORT: any = process.env.PORT;
const app: Application = express();

// *** MIDDLEWARE AND STUFF *** //
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(bodyParser.json()); //NEEDS TO RECEIVE DATA IN JSON FORMAT 

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public'))) //CSS from public


// *** ROUTES *** //
app.use('/', loginRoutes)

app.get('/', requireLogin, (req: Request, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Home page"
    }

    res.status(200)
    res.render('home', payload)

})


//*** 404 ***//
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const error = {
        message: "Error couldn't find this route",
        code: 404
    }

    res.status(404)
    res.send(error);
})


// *** MONGO *** //
const url = process.env.MONGO_URL;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.Promise = global.Promise;
mongoose.connect(url!, options as ConnectOptions)
        .then(() => {console.log("Connected to MongoDB")})
        .catch((err) => console.log(err));

//*** BEEP BOOP ***//
app.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})
