import express, { Router } from 'express';
import { register, login } from "../controller/auth";
import {GetUsers, ShowUsers} from "../controller/user/user.controller";
import {verifyToken} from "../common/middleware/jwt.middleware";

const router = Router()

const authRouter = Router()
authRouter.post('/login', login)
authRouter.post('/register', register)

const userRouter = Router()
userRouter.get('', GetUsers)
userRouter.get('/:id', ShowUsers)

router.use('/auth', authRouter)
router.use('/users', verifyToken, userRouter)

export default router;