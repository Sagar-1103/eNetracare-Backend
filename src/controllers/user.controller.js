import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const loggedUser = await User.findById(userId);
      const accessToken = loggedUser.generateAccessToken();
      const refreshToken = loggedUser.generateRefreshToken();
  
      loggedUser.refreshToken = refreshToken;
      await loggedUser.save({ validateBeforeSave: "false" });
      return { accessToken, refreshToken, loggedUser };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access tokens"
      );
    }
  };

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    email,
    password
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  
    const {email, password } = req.body;
  
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
  
    const user = await User.findOne({
      $or: [{ email }],
    });
  
    if (!user) {
      throw new ApiError(404, "User doesnt exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  
    const { accessToken, refreshToken, loggedUser } =
      await generateAccessAndRefreshTokens(user._id);
    loggedUser.password = undefined;
    loggedUser.refreshToken = undefined;
  
    const options = {
      httpOnly: true,
      secure: true
    };
  
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  });

  const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { 
          new: true
      }
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out"))
  
  });

  const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401,"Unauthorized Request");
    }
  
    try {
      const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401,"Invalid Refresh Token");
      }
    
      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401,"Refresh Token is expired or used");
      }
    
      
      const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
      const options = {
        httpOnly: true,
        secure: true,
      };
    
      res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken},"Access Token Refreshed Successfully"));
      
    } catch (error) {
      throw new ApiError(401,error?.message || "Invalid Refresh Token");
    }
  })

  const getCurrentUser = asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,req.user,"Current User fetched Successfully"));
  })

  const changeCurrentUserPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  
    if (!isPasswordCorrect) {
      throw new ApiError(400,"Invalid old Password")
    }
  
    user.password = newPassword;
  
    await user.save({validateBeforeSave:false})
  
    return res.status(200).json(new ApiResponse(200,{},"Password Changed Successfully"));
  
  })

export { registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,changeCurrentUserPassword};
