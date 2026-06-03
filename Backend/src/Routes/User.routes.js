import {Router} from 'express'
import {createUser, loginUser, logoutUser, getUser,sendEmailOTP, verifyOTPPassword, resetPassword, verifyOTPEmailVerification} from '../Controllers/User.controller.js'
import {verifyUser} from '../Middlewares/Auth.middleware.js'
const userRouter = Router()

userRouter.route("/register").post(createUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyUser,logoutUser)
userRouter.route("/getUser").get(verifyUser, getUser)
userRouter.route("/sendOTP").post(sendEmailOTP)
userRouter.route("/verifyOTP").post(verifyOTPPassword)
userRouter.route("/resetPassword").patch(resetPassword)
userRouter.route("/verifyEmail").post(verifyOTPEmailVerification)

export default userRouter; 