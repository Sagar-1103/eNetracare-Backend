import mongoose, { Schema } from "mongoose";

const gallerySchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageDate:{
      type:String,
      required:true
  },
  },
  {
    timestamps: true,
  }
);

export const Gallery = mongoose.model("Gallery",gallerySchema);
