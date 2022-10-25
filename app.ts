import express, { Application, Request, Response} from 'express'


const PORT: number = 8888;
const app: Application = express();

app.get('/', (req, res) => {
    res.send("AAAAAAAAAAAA")
})


app.get('/h', (req, res) => {
    res.send("BBBBBBBBBBBBB")
})

//*** 404 ***//
app.all('*', (req: Request, res: Response) => {
    const error = {
        message: "Error couldn't find this route",
        code: 404
    }

    res.send(error);
});

 //*** BEEP BOOP ***//
 app.listen(PORT, () => {
    console.log(`Your server available at http://localhost:${PORT}`);
})