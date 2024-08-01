import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";
import { Gallery } from "../models/gallery.model.js";

const postGallery = asyncHandler(async(req,res)=>{
    const {description,imageDate} = req.body;
    if(!description && !imageDate){
        throw new ApiError(400,"Please provide all the details of the Image.");
    }
    const imageLocalPath = await req?.file?.path;
    if(!imageLocalPath){
        throw new ApiError(400,"Please upload the image for uploading to gallery.");
    }

    const galleryImage = await uploadOnCloudinary(imageLocalPath);
    if(!galleryImage){
        throw new ApiError(500,"Some error occured while uploading image to server");
    }

    const createdGalleryPost = await Gallery.create({
        description,
        imageDate,
        image:galleryImage?.url,
        imageId:galleryImage?.public_id,
    })
    if (!createdGalleryPost) {
        throw new ApiError(500, "Something went wrong while posting the image to gallery");
      }
    
      return res
        .status(201)
        .json(new ApiResponse(200, createdGalleryPost, "Image posted to gallery successfully"));
})

const updateGallery = asyncHandler(async(req,res)=>{
    const imageId = req.params?.id;
    const imageLocalPath = await req?.file?.path;

    if(!imageLocalPath){
        throw new ApiError(400,"Gallery Image is required.");
    }

    const updatedGalleryImage = await uploadOnCloudinary(imageLocalPath);

    const galleryImage = await Gallery.findByIdAndUpdate(imageId,{
        $set:{image:updatedGalleryImage?.url,imageId:updatedGalleryImage?.public_id}
    })

    if(!galleryImage){
        await deleteFromCloudinary(updatedGalleryImage?.imageId);
        throw new ApiError(400,"Couldnt get gallery image which was to be updated.")
    }
    
    await deleteFromCloudinary(galleryImage?.imageId);
    galleryImage.image=updatedGalleryImage?.url;
    galleryImage.imageId=updatedGalleryImage?.public_id

    res.status(200).json(new ApiResponse(200,galleryImage,"Gallery Image Updated Successfully."));
})

const updateGalleryContent = asyncHandler(async(req,res)=>{
    const imageId = req.params?.id;
    const {newDescription,newImageDate} = req.body;

    if(!newDescription && !newImageDate){
        throw new ApiError(400,"Image Details is required.");
    }

    const updatedGalleryImage = await Gallery.findByIdAndUpdate(imageId,{
        $set:{description:newDescription,imageDate:newImageDate}
    },{
        new:true
    })
    res.status(200).json(new ApiResponse(200,updatedGalleryImage,"Gallery Image Content Updated Successfully."))
})

const getAllGallery = asyncHandler(async(req,res)=>{
    const allImages = await Gallery.find({});

    if (!allImages) {
        throw new ApiError(500,"Error fetching all the images from gallery.");
    }

    res.status(200).json(new ApiResponse(200,allImages,"All images fetched successfully from gallery."))
})

const deleteGallery = asyncHandler(async(req,res)=>{
    const imageId = req.params?.id;

    const deletedGalleryImage = await Gallery.findByIdAndDelete(imageId);
    
    await deleteFromCloudinary(deletedGalleryImage?.imageId);

    if(!deletedGalleryImage){
        throw new ApiError(400,"Error deleting image from gallery.")
    }

    res.status(200).json(new ApiResponse(200,deletedGalleryImage,"Image from gallery deleted successfully."))
})

export {postGallery,updateGallery,updateGalleryContent,getAllGallery,deleteGallery}