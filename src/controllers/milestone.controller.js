import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Milestone} from "../models/milestone.model.js"

const postMilestone = asyncHandler(async(req,res)=>{
    const {milestoneText,milestoneDate} = req.body;
    if(!milestoneText && !milestoneDate){
        throw new ApiError(400,"Please provide all the details of the milestone.");
    }
    const createdMilestone = await Milestone.create({
        milestoneText,
        milestoneDate,
    })
    if (!createdMilestone) {
        throw new ApiError(500, "Something went wrong while posting the milestone");
      }
    
      return res
        .status(201)
        .json(new ApiResponse(200, createdMilestone, "Milestone posted Successfully"));
})

const updateMilestoneContent = asyncHandler(async(req,res)=>{
    const milestoneId = req.params?.id;
    const {newMilestoneText,newMilestoneDate} = req.body;

    if(!newMilestoneText && !newMilestoneDate){
        throw new ApiError(400,"All fields are required.");
    }

    const updatedMilestone = await Milestone.findByIdAndUpdate(milestoneId,{
        $set:{milestoneText:newMilestoneText,milestoneDate:newMilestoneDate}
    },{
        new:true
    })
    res.status(200).json(new ApiResponse(200,updatedMilestone,"Milestone Content Updated Successfully."))
})

const getAllMilestones = asyncHandler(async(req,res)=>{
    const allMilestones = await Milestone.aggregate([
        {
          $sort: {
            createdAt: 1
          }
        }
      ]);

    if (!allMilestones) {
        throw new ApiError(500,"Error fetching all the milestones.");
    }

    res.status(200).json(new ApiResponse(200,allMilestones,"All milestones fetched Successfully."))
})

const deleteMilestone = asyncHandler(async(req,res)=>{
    const milestoneId = req.params?.id;
    const deletedMilestone = await Milestone.findByIdAndDelete(milestoneId);

    if(!deletedMilestone){
        throw new ApiError(400,"Error deleting milestone.")
    }

    res.status(200).json(new ApiResponse(200,deletedMilestone,"Milestone deleted Successfully."))
})

export {postMilestone,updateMilestoneContent,getAllMilestones,deleteMilestone}