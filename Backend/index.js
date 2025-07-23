import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv"
dotenv.config()
import cors from 'cors'
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

const app = express()
const PORT = process.env.PORT

connectDb()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: "https://ai-virtual-assistant-frontend-ngf5.onrender.com",
    credentials: true
}))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(PORT,()=>{
    console.log(`The server is runing at http://localhost:${PORT}`)
})
