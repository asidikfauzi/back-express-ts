import express from "express";
import {GetUsers} from "../controller/user/user.controller";

const router = express.Router();
router.use('users', router)
router.get("/")

export default router;