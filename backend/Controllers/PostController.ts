import express, { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { Jwt } from "jsonwebtoken";

export const route = express.Router();

// *** ROUTES *** //
route.get("/posts", async (req:Request, res: Response, next: NextFunction) => {

})

route.get("/post/:id", async (req:Request, res: Response, next: NextFunction) => {

})

route.post("/new", async (req:Request, res: Response, next: NextFunction) => {

})

