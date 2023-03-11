import express, { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { USER } from "../Models/User";
import jwt, { Jwt } from "jsonwebtoken";

export const route = express.Router();

// *** ROUTES *** //
route.post("/login", async (req:Request, res: Response, next: NextFunction) => {

    interface RequestData{
        username: string,
        password: string
    }
    
    // *** USER DATA *** //
    const userLoginData: RequestData = {
        "username": req.body.username,
        "password": req.body.password
    }

    console.log(userLoginData)

    if(!(userLoginData.username && userLoginData.password)){
        return res.status(200).send({ error: "ERROR: Login credentials are empty !" });
    }

    const user = await USER.findOne({
        $or: [ //FIND USER BY STUFF FROM ARRAY 
            { username: userLoginData.username },
            { email: userLoginData.username }
        ]
    })
    .catch((err: any) => {
        console.log(err);
        return res.status(200).send({ error: "ERROR: Something went wrong, try again !" });
    })

    if(!user){
        return res.status(200).send({ error: "ERROR: User not found !" });
    }

    console.log(user)
    const passwordMatch = await bcrypt.compare(userLoginData.password, user.password);
    if(!passwordMatch){
        return res.status(200).send({ error: "ERROR: Something went wrong, try again !" });
    }

    // JWT TOKEN
    const token: string = await jwt.sign({
        "user_id": user.id,
        "username": user.username,
        "first_name": user.firstname,
        "last_name": user.lastName,
        "profile_picture": user.profilePicture
    }, "supersecretkey")
  
    return res.status(200).send({"token": token})

})

route.post("/register", async (req: Request, res: Response, next: NextFunction) => {

    interface RegisterData{
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
    }

    const newUserData: RegisterData = req.body;
    if(newUserData == null || Object.keys(newUserData).length == 0){
        return res.status(503).send({ error: "ERROR: User data not sent, try again !" });
    }

    const firstName = newUserData.firstName;
    const lastName = newUserData.lastName;
    const username = newUserData.username;
    const email = newUserData.email;
    const password = newUserData.password;

    if(firstName == null || lastName == null || username == null || email == null || password == null ){
        return res.status(200).send({ error: "ERROR: User data not complete, try again !" });
    }

    const foundUser = await USER.findOne({
        $or: [
            { 'username': username },
            { 'email' : email }
        ]
    }).catch((err: any) => {
        console.log(err);
        return res.status(200).send({ error: "ERROR: Something went wrong, try again !" });
    })

    if (foundUser){
        if(email == foundUser.email){
            return res.status(200).send({ error: "ERROR: Email already in use !" });
        }else{
            return res.status(200).send({ error: "ERROR: Username already in use !" });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new USER({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword
    })

    try {
        await newUser.save();
        return res.status(200).send({ message: "New user created !" });
    } catch (err) {
        console.log(err);
        return res.status(200).send({ error: "ERROR: Something went wrong, try again !" });
    }
});
