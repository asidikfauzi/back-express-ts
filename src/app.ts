import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {auth, task} from "./route";

dotenv.config()

const app: Express = express()
const port = process.env.APP_PORT || 8080

// Middleware untuk mem-parsing body permintaan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', auth, task);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
})