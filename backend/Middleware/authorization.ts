import jwt from "jsonwebtoken";



export const authorization = async (req: any, res: any, next: any) => {

    if(req.method === 'OPTIONS') { return next(); }

    try {
        const token: string = req.headers.authorization.split(' ')[1] //Authorization: 'Bearer: TOKEN'

        const decodedToken: Object = await jwt.verify(token, 'supersecretkey');
        req.decodedToken = decodedToken;
        next();
        
    } catch (err: any) {
        console.log(err);

        return next({
            "Code" : 401,
            "Message": "Invalid path, Authentication failed."
        })
        
    }

}