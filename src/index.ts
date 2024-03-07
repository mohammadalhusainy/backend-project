import express from "express"
import * as dotenv from "dotenv";

import dbConnect from "./config/dbConnect";
import userRouter from "./router/userRouter";
import cookieParser from "cookie-parser"
import cors from "cors"



dotenv.config()

dbConnect()

const app = express()
app.use(cors({credentials: true , origin:"https://loclhost:3000"}))
    
app.use(express.json())
app.use(cookieParser())

app.use(userRouter)

const PORT = process.env.PORT || 3003

app.listen(PORT,()=>console.log(`Server is running on PORT https://loclhost:${PORT}`))