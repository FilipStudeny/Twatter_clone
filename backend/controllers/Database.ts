import mongoose, { ConnectOptions } from 'mongoose';


export class Database{
    private url: any;

    public constructor(url: any){
        this.url = url;
    }

    public connect(){
        const options = {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            family: 4 // Use IPv4, skip trying IPv6
        }
        mongoose.Promise = global.Promise;
        mongoose.connect(this.url!, options as ConnectOptions)
                .then(() => {console.log("Connected to MongoDB")})
                .catch((err) => console.log(err));
    }
}



