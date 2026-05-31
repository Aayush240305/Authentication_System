import {asyncHandler} from '../Utilities/asyncHandler.js'
import {apiError} from '../Utilities/apiError.js'
import jwt from 'jsonwebtoken'
import {User} from '../Models/User.model.js'

export const verifyUser = asyncHandler(async(req,res,next)=>{
    
    const token = req.cookies.accessToken || req.header("authorization")?.replace("Bearer ", "");
    
    try{
      const decodedUser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      
      const user = await User.findById(decodedUser?._id).select("-password -refreshToken");
      
      if(!user){
        throw new apiError("401", "invalid token");
      }
      req.user = user;
      
      next();
      
    }catch(err){
    throw new apiError(400, err?.message || "access is invalid")
    }
})