import {User} from '../Models/User.model.js';
import {asyncHandler} from '../Utilities/asyncHandler.js';
import {apiError} from '../Utilities/apiError.js';
import {apiResponse} from '../Utilities/apiResponse.js';
import {sendOTP} from '../Utilities/sendOTP.js';

const createAccessAndRefreshToken = async(userId)=>{
  try{
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken, refreshToken}

  }catch(error){
    throw new ApiError(501, "Something went wrong at time of creation of access token and refresh token",error.message)
  }
}

const options = {
  httpOnly:true,
  secure:false
}

const createUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new apiError(400, 'Name, email and password are required');
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new apiError(400, 'Email already exists');
    }

    const user = await User.create({name, email, password});

    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    if(!createdUser) {
        throw new apiError(500, "Something went wrong! Try again")
    }
    
    return res.status(201).json(new apiResponse(201, createdUser, 'User created successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        throw new apiError(400, 'Email and password are required');
    }

    const user = await User.findOne({email});

    if(!user){
        throw new apiError(400, 'User not found');
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new apiError(401, 'Invalid password');
    }

    const {accessToken, refreshToken} = await createAccessAndRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, loggedUser, "User logged in successfully" ))

});

const logoutUser = asyncHandler(async (req, res)=>{
    const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      },
    },
    {
        new:true
    }
  )

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new apiResponse(
    200, 
    "User Logged Out successfully"
    )
  )
 })

 const getUser = asyncHandler(async(req, res)=>{
  const user = await User.findById(req.user._id).select('-password -refreshToken');

  if(!user){
    throw new apiError(404, "User not found")
  }

  return res.status(200).json(new apiResponse(200, user, "User fetched successfully"))
 })

 const sendEmailOTP = asyncHandler(async(req, res)=>{
  const {email} = req.body;

  if(!email){
    throw new apiError(400, "Email is required")
  }

  const user = await User.findOne({email});
  
  if(!user){
    throw new apiError(404, "User not found")
  }

  const otp = user.generateOTP();

  user.otp = otp;

  user.otpExpiry = Date.now() + 5*60*1000;
  
  await user.save({validateBeforeSave:false});

  await sendOTP(email, otp);

  return res.status(200).json(new apiResponse(200, {}, "OTP sent successfully"))

 })

 const verifyOTPPassword = asyncHandler(async(req,res)=>{
  const {email,otp} = req.body;
  if(!email || !otp){
    throw new apiError(401, "Email and OTP are required")
  }

  const user = await User.findOne({email});

  if(!user){
    throw new apiError(404, "User not found")
  }

  if(user.otp !== otp || user.otpExpiry < Date.now()){
    throw new apiError(400, "Invalid or expired OTP")
  }

  user.passwordResetPermission = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save({validateBeforeSave:false});

  return res.status(200).json(new apiResponse(200, {}, "OTP verified successfully"))

 })

 const resetPassword = asyncHandler(async(req,res)=>{
  const {email, newPassword} = req.body;

  if(!email || !newPassword){
    throw new apiError(400, "Email and new password are required")
  }

  const user = await User.findOne({email});

  if(!user){
    throw new apiError(404, "User not found")
  }

  if(!user.passwordResetPermission){
    throw new apiError(400, "Password reset not allowed")
  }
  
  user.password = newPassword;
  user.passwordResetPermission = false;

  await user.save();

  return res.status(200).json(new apiResponse(200, {}, "Password reset successfully"))

 })

export {createUser, loginUser, logoutUser, getUser, sendEmailOTP, verifyOTPPassword, resetPassword};