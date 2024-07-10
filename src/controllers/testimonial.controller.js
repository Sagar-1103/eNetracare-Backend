import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Testimonial} from "../models/testimonial.model.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"

const postTestimonial = asyncHandler(async(req,res)=>{
    const {content,patientName} = req.body;
    if(!content && !patientName){
        throw new ApiError(400,"Please provide all the details of the testimonial.");
    }
    const imageLocalPath = await req?.file?.path;
    if(!imageLocalPath){
        throw new ApiError(400,"Please upload the image for the testimonial patient image.");
    }

    const testimonialPatientImage = await uploadOnCloudinary(imageLocalPath);
    if(!testimonialPatientImage){
        throw new ApiError(500,"Some error occured while uploading image to server");
    }
    const createdTestimonial = await Testimonial.create({
        content,
        patientName,
        patientImage:testimonialPatientImage?.url,
        patientImageId:testimonialPatientImage?.public_id,
        author:req.user?.email,
    })
    if (!createdTestimonial) {
        throw new ApiError(500, "Something went wrong while posting the Testimonial");
      }
    
      return res
        .status(201)
        .json(new ApiResponse(200, createdTestimonial, "Testimonial posted Successfully"));
})

const updatePatientImage = asyncHandler(async(req,res)=>{
    const TestimonialId = req.params?.id;
    const imageLocalPath = await req?.file?.path;

    if(!imageLocalPath){
        throw new ApiError(400,"Patient Image is required.");
    }

    const updatedPatientImage = await uploadOnCloudinary(imageLocalPath);

    const testimonial = await Testimonial.findByIdAndUpdate(TestimonialId,{
        $set:{patientImage:updatedPatientImage?.url,patientImageId:updatedPatientImage?.public_id}
    })

    if(!testimonial){
        await deleteFromCloudinary(testimonial?.patientImageId);
        throw new ApiError(400,"Couldnt get testimonial whos patient image is to be updated")
    }
    
    await deleteFromCloudinary(testimonial?.patientImageId);
    testimonial.patientImage=updatedPatientImage?.url;
    testimonial.patientImageId=updatedPatientImage?.public_id

    res.status(200).json(new ApiResponse(200,testimonial,"Testimonial Patient Image Updated Successfully."));
})

const updateTestimonialContent = asyncHandler(async(req,res)=>{
    const testimonialId = req.params?.id;
    const {newPatientName,newContent} = req.body;

    if(!newPatientName && !newContent){
        throw new ApiError(400,"All fields are required.");
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(testimonialId,{
        $set:{patientName:newPatientName,content:newContent}
    },{
        new:true
    })
    res.status(200).json(new ApiResponse(200,updatedTestimonial,"Testimonial Content and Patient Name Updated Successfully."))
})

const deleteTestimonial = asyncHandler(async(req,res)=>{
    const testimonialId = req.params?.id;
    
    const deletedTestimonial = await Testimonial.findByIdAndDelete(testimonialId);
    
    await deleteFromCloudinary(deletedTestimonial?.patientImageId);

    if(!deletedTestimonial){
        throw new ApiError(400,"Error deleting Testimonial.")
    }

    res.status(200).json(new ApiResponse(200,deletedTestimonial,"Testimonial deleted Successfully."))
})

const getAllTestimonials = asyncHandler(async(req,res)=>{
    const allTestimonials = await Testimonial.find({});

    if (!allTestimonials) {
        throw new ApiError(500,"Error fetching all the testimonials.");
    }

    res.status(200).json(new ApiResponse(200,allTestimonials,"All testimonials fetched Successfully."))
})

export {postTestimonial,updatePatientImage,updateTestimonialContent,deleteTestimonial,getAllTestimonials}