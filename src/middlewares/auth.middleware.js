import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config()

const adminEmails = [process.env.ADMIN_1,process.env.ADMIN_2];

const verifyJWT = asyncHandler(async(req,_,next)=>{

    try {
        const token = req.cookies?.accessToken ||req.body.token|| req.header("Authorization")?.replace("Bearer ","");
        console.log(req.cookies?.accessToken, req.header("Authorization")?.replace("Bearer ",""),req.body.token);
        if (!token) {
            throw new ApiError(401,"Unauthorized request");
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401,"Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})

const verifyAdmin = asyncHandler(async(req,_,next)=>{
    try {
        const userEmail = req.user?.email;
        console.log(userEmail);
        if (!adminEmails.includes(userEmail)) {
            throw new ApiError(401,"You are not the admin.");
        }
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})


export {verifyJWT,verifyAdmin}