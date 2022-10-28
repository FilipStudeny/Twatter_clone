import express, { Application, NextFunction, Request, Response} from 'express'
import * as dotenv from 'dotenv'
import { requireLogin} from './middleware/authentication';
import { route as loginRoutes } from './routes/loginRoutes';
import path from 'path';
import bodyParser from "body-parser";

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


//*** BEEP BOOP ***//
app.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})
