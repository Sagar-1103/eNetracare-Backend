import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";
import {News} from "../models/news.model.js"

const postNews = asyncHandler(async(req,res)=>{
    const {title,description} = req.body;
    if(!title && !description){
        throw new ApiError(400,"Please provide all the details of the news.");
    }
    const imageLocalPath = await req?.file?.path;
    if(!imageLocalPath){
        throw new ApiError(400,"Please upload the image for the news cover image.");
    }

    const newsCoverImage = await uploadOnCloudinary(imageLocalPath);
    if(!newsCoverImage){
        throw new ApiError(500,"Some error occured while uploading image to server");
    }

    const createdNews = await News.create({
        title,
        description,
        image:newsCoverImage?.url,
        imageId:newsCoverImage?.public_id,
        author:req.user?.email,
    })
    if (!createdNews) {
        throw new ApiError(500, "Something went wrong while posting the news");
      }
    
      return res
        .status(201)
        .json(new ApiResponse(200, createdNews, "News posted Successfully"));
})

const updateNewsCoverImage = asyncHandler(async(req,res)=>{
    const newsId = req.params?.id;
    const imageLocalPath = await req?.file?.path;

    if(!imageLocalPath){
        throw new ApiError(400,"News Image Cover is required.");
    }

    const updatedNewsCoverImage = await uploadOnCloudinary(imageLocalPath);

    const news = await News.findByIdAndUpdate(newsId,{
        $set:{image:updatedNewsCoverImage?.url,imageId:updatedNewsCoverImage?.public_id}
    })

    if(!news){
        await deleteFromCloudinary(updatedNewsCoverImage?.imageId);
        throw new ApiError(400,"Couldnt get news whos cover image is to be updated")
    }
    
    await deleteFromCloudinary(news?.imageId);
    news.image=updatedNewsCoverImage?.url;
    news.imageId=updatedNewsCoverImage?.public_id

    res.status(200).json(new ApiResponse(200,news,"News Image Updated Successfully."));
})

const updateNewsContent = asyncHandler(async(req,res)=>{
    const newsId = req.params?.id;
    const {newTitle,newDescription} = req.body;

    if(!newTitle && !newDescription){
        throw new ApiError(400,"All fields are required.");
    }

    const updatedNews = await News.findByIdAndUpdate(newsId,{
        $set:{title:newTitle,description:newDescription}
    },{
        new:true
    })
    res.status(200).json(new ApiResponse(200,updatedNews,"News Content Updated Successfully."))
})

const getAllNews = asyncHandler(async(req,res)=>{
    const allNews = await News.find({});

    if (!allNews) {
        throw new ApiError(500,"Error fetching all the news.");
    }

    res.status(200).json(new ApiResponse(200,allNews,"All news fetched Successfully."))
})

const deleteNews = asyncHandler(async(req,res)=>{
    const newsId = req.params?.id;

    
    const deletedNews = await News.findByIdAndDelete(newsId);
    
    await deleteFromCloudinary(deletedNews?.imageId);

    if(!deletedNews){
        throw new ApiError(400,"Error deleting news.")
    }

    res.status(200).json(new ApiResponse(200,deletedNews,"News deleted Successfully."))
})

export {postNews,updateNewsCoverImage,updateNewsContent,getAllNews,deleteNews}