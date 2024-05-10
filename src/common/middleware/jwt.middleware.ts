import express, {Request, Response, NextFunction, Express} from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import {ResponseAPI} from "../helper/response.helper";

dotenv.config()

const secret = process.env.SECRET_KEY || "secret"

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const startTime: Date = new Date();
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, secret);
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        return ResponseAPI(res, false, 401, "Unauthorized", {error: "Please authenticate"}, startTime)
    }
};




