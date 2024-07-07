import dotenv from "dotenv";
import connectDB from "./src/config/databaseConfig.js";
import { app } from "./src/app.js";
import { connectCloudinary } from "./src/config/cloudinaryConfig.js";
dotenv.config()

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR: ",error);
        throw error
    })
    app.listen(process.env.PORT||3000,()=>{
        connectCloudinary();
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection error !!! ",err);
})
