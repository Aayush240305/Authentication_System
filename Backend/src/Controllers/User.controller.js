import {User} from '../Models/User.model.js';
import {asyncHandler} from '../Utilities/asyncHandler.js';
import {apiError} from '../Utilities/apiError.js';
import {apiResponse} from '../Utilities/apiResponse.js';

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
    
    return res.status(201).json(new apiResponse(201, 'User created successfully', createdUser));
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

    const {accessToken, refreshToken} = await createAccessAndRefreshToken(user.id)

    const loggedUser = await User.findById(user._id).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, "User logged in successfully", loggedUser))

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
  .json(new ApiResponse(
    200, 
    "User Logged Out successfully"
    )
  )
 })

export {createUser, loginUser, logoutUser};