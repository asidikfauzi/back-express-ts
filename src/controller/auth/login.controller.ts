import { Request, Response } from "express";
import {ReqLogin} from "../../model/user.model";
import validator from "validator";
import {PrismaClient} from "@prisma/client";
import {ResponseAPI, ResponseDataAPI} from "../../common/helper/response.helper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response)=> {
    const startTime: Date = new Date();

    const { email, password }: ReqLogin = req.body;

    const errors: { [key: string]: string } = {};

    if (!email) {
        errors.email = "Email is required";
    }

    if (!password) {
        errors.password = "Password is required";
    }

    if (!validator.isEmail(email)) {
        errors.email = "Email format not valid";
    }

    if (Object.keys(errors).length > 0) {
        return ResponseAPI(res, false, 422, "Unprocessable Entity", { error: errors }, startTime);
    }

    const user = await prisma.user.findFirst({
        where: { email: email }
    })

    if (!user) {
        errors.email = "Email not found"
        return ResponseAPI(res, false, 404, "Not Found", { error: errors }, startTime);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return ResponseAPI(res, false, 401, "Unauthorized", { error: "Invalid password" }, startTime);
    }

    const secret = process.env.SECRET_KEY || "secret";
    const token = jwt.sign({ _id: user.id?.toString(), name: user.name }, secret, {
        expiresIn: '7 days',
    });

    return ResponseDataAPI(res, true, 200, "OK", {success: "Successfully Login!"}, token, startTime);

}