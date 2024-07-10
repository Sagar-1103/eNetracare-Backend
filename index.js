import dotenv from "dotenv";
import connectDB from "./src/config/databaseConfig.js";
import { app } from "./src/app.js";
import { connectCloudinary } from "./src/config/cloudinaryConfig.js";
import os from 'os';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(os.tmpdir(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

dotenv.config()

connectCloudinary();

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR: ",error);
        throw error
    })
    app.listen(process.env.PORT||3000,()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection error !!! ",err);
})
