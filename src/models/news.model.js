import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema(
  {
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    imageId:{
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


export const News = mongoose.model("News",newsSchema);