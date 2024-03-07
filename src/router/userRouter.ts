import Router from "express"
import {getAllUsers, userLogin, userLogout, userRegister, verifyAccount} from "../controller/userController";


const userRouter = Router()

userRouter.post("/api/user/register",userRegister)
userRouter.get("/api/user/verify_account/:rightToken",verifyAccount)
userRouter.get("/api/user/getalluser",getAllUsers)
userRouter.post("/api/user/login",userLogin)
userRouter.post("/api/user/logout",userLogout)


export default userRouter