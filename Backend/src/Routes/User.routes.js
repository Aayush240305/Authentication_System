import {Router} from 'express'
import {createUser, loginUser, logoutUser} from '../Controllers/User.controller.js'
import {verifyUser} from '../Middlewares/Auth.middleware.js'
const userRouter = Router()

userRouter.route("/register").post(createUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyUser,logoutUser)

export default userRouter; 