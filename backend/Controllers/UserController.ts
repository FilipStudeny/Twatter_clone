import express, { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import User, { UserModel } from "../Models/User";
import jwt, { Jwt } from "jsonwebtoken";

export const route = express.Router();

// *** ROUTES *** //

route.get("/users", async (req:Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find({}, "_id username profilePicture")
            .sort({
                "createdAt":-1 //Descending order
            });

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
})

route.post("/login", async (req:Request, res: Response, next: NextFunction) => {

    interface RequestData{
        "username": string,
        "password": string
    }
    
    // *** USER DATA *** //
    const userLoginData: RequestData = {
        "username": req.body.username,
        "password": req.body.password
    }


    if(!(userLoginData.username && userLoginData.password)){
        return res.status(400).send({ error: "Bad Request: User data not sent, try again !" });
    }

    const response: any = await UserModel.findOne({
        $or: [ //FIND USER BY STUFF FROM ARRAY 
            { username: userLoginData.username },
            { email: userLoginData.username }
        ]
    })
    .catch((err: any) => {
        console.log(err);
        return res.status(500).send({ error: "Internal Server Error: Something went wrong, try again !" });
    })
    const user: User = response;

    if(!user){
        return res.status(401).send({ error: "ERROR: User not found !" }); // Unauthorized
    }

    const passwordMatch = await bcrypt.compare(userLoginData.password, user.password);
    if(!passwordMatch){
        return res.status(401).send({ error: "Invalid username or password !" }); // Unauthorized
    }

    // JWT TOKEN
    const token: string = await jwt.sign({
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    }, "supersecretkey")
  
    return res.status(200).send({
        "token": token,
        "user_id": user._id,
        'username': user.username,
        "first_name": user.firstName,
        "last_name": user.lastName,
        "profile_picture": user.profilePicture
    })
})

route.post("/register", async (req: Request, res: Response, next: NextFunction) => {

    interface RegisterData{
        "username": string,
        "firstName": string,
        "lastName": string,
        "email": string,
        "password": string
    }

    const newUserData: RegisterData = req.body;
    if(newUserData == null || Object.keys(newUserData).length == 0){
        return res.status(400).send({ error: "Bad Request: User data not sent, try again !" });
    }

    const firstName = newUserData.firstName;
    const lastName = newUserData.lastName;
    const username = newUserData.username;
    const email = newUserData.email;
    const password = newUserData.password;

    if(firstName == null || lastName == null || username == null || email == null || password == null ){
        return res.status(400).send({ error: "Bad Request: User data not complete, try again !" });
    }

    const response: any = await UserModel.findOne({
        $or: [
            { 'username': username },
            { 'email' : email }
        ]
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).send({ error: "Internal Server Error: Something went wrong, try again !" });
    })
    const foundUser: User = response;


    if (foundUser){
        if(email == foundUser.email){
            return res.status(409).send({ error: "Conflict: Email already in use !" });
        }else{
            return res.status(409).send({ error: "Conflict: Username already in use !" });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword
    })

    try {
        await newUser.save();
        return res.status(201).send({ message: "Created: New user created !" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Internal Server Error: Something went wrong, try again !" });
    }
});
