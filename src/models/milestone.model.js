import mongoose,{Schema} from "mongoose";

const milestoneSchema = new Schema({
    milestoneText:{
        type:String,
        required:true
    },
    milestoneDate:{
        type:String,
        required:true
    },
},
{
    timestamps:true
})

export const Milestone = mongoose.model("Milestone",milestoneSchema)
