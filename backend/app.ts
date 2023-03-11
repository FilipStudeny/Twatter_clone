import express, { Application, Express, NextFunction, Response, Request } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import {route as UserController} from "./Controllers/UserController";
import cors from 'cors'
import bodyParser from 'body-parser'

const PORT: number = 8888;
const app: Application = express();
const dbConnectionURL = "mongodb://localhost:27017/Twatter";

// CORS FIX

app.use((req: Request, res: Response, next: NextFunction) => {
    
    //CORS FIX
    //ADD HEADER TO REQUREESTS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    
    next();
});

app.use(bodyParser.json())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("hello world")
});

app.use("/api/user/", UserController);



//*** 404 ***//
app.all('*', (req: Request, res: Response, next: NextFunction) => {

    res.status(404).send("Page not found: Unknown URI");
})

const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}

mongoose.Promise = global.Promise;
mongoose.connect(dbConnectionURL, options as ConnectOptions)
        .then(() => {console.log("Connected to MongoDB")})
        .catch((err) => console.log(err));

//*** BEEP BOOP ***//
app.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})