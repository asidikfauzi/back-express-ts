import { Request, Response } from "express";
import { ReqUser } from "../../model/user.model"
import { ResponseAPI } from "../../common/helper/response.helper";
import validator from "validator";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    const startTime: Date = new Date();

    const { name, email, password, confirm_password }: ReqUser = req.body;

    const errors: { [key: string]: string } = {};

    if (!name) {
        errors.name = "Name is required";
    }

    if (!email) {
        errors.email = "Email is required";
    }

    if (!password) {
        errors.password = "Password is required";
    }

    if (!validator.isEmail(email) && email) {
        errors.email = "Email format not valid";
    }

    if (password && password.length < 8 ) {
        errors.password = "Password must be at least 8 characters";
    }

    if (password && password !== confirm_password && password.length > 8 ) {
        errors.passwprd = "Password doesnt match"
    }

    if (Object.keys(errors).length > 0) {
        return ResponseAPI(res, false, 422, "Unprocessable Entity", { error: errors }, startTime);
    }

    const existUser = await prisma.user.findFirst({
        where: { email: email },
    })

    if (existUser) {
        errors.email = "Email already exists"
        return ResponseAPI(res, false, 409, "Conflict", { error: errors }, startTime);
    }

    try {

        const hashPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                createdAt: new Date(),
            }
        });

        return ResponseAPI(res, true, 201, "Created", { success: "Successfully Add Data" }, startTime);

    } catch (error) {

        return ResponseAPI(res, false, 500, "Internal Server Error", { error: error }, startTime);

    } finally {

        await prisma.$disconnect();

    }
}