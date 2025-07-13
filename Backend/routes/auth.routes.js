import express from "express"
import { Login, logOut, signUP } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/signup",signUP)
authRouter.post("/signin",Login)
authRouter.get("/logout",logOut)

export default authRouter