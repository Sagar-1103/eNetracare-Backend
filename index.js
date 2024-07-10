import dotenv from "dotenv";
import connectDB from "./src/config/databaseConfig.js";
import { app } from "./src/app.js";
import { connectCloudinary } from "./src/config/cloudinaryConfig.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log("upload folder created");
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
