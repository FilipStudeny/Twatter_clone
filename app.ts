import express, { Application, NextFunction, Request, Response} from 'express'
import * as dotenv from 'dotenv'

// *** CONFIG *** //
dotenv.config();

const PORT: any = process.env.PORT;
const app: Application = express();

// *** MIDDLEWARE AND STUFF *** //
app.set('view engine', 'pug')
app.set('views', 'views')

// *** ROUTES *** //
app.get('/', (req: Request, res: Response, next: NextFunction) => {

    const payload: Object = {
        pageTitle : "Home page"
    }

    res.status(200)
    res.render('home', payload)

})


app.get('/h', (req: Request, res: Response, next: NextFunction) => { 
    res.status(200)
    res.send("BBBBBBBBBBBBB")
})

//*** 404 ***//
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const error = {
        message: "Error couldn't find this route",
        code: 404
    }

    res.status(404)
    res.send(error);
});


//*** BEEP BOOP ***//
app.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})
