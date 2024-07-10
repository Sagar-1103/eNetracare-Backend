import mongoose, { Schema } from "mongoose";

const testmonialSchema = new Schema(
  {
    content:{
        type:String,
        required:true,
    },
    patientImage:{
        type:String,
    },
    patientImageId:{
        type:String,
    },
    patientName:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    }
  },
  {
    timestamps: true,
  }
);

export const Testimonial = mongoose.model("Testimonial",testmonialSchema);