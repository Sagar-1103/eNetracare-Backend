import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(cookieParser());
app.use(express.json({limit:"16kb"}));

app.get("/",(req,res)=>{
    res.status(200).json({"Server Status":"Connected"});
})

import userRouter from "./routes/user.routes.js";
import newsRouter from "./routes/news.routes.js"
import testimonialRouter from "./routes/testimonial.routes.js"
import milestoneRouter from "./routes/milestones.routes.js"
app.use("/api/v1/users",userRouter);
app.use("/api/v1/news",newsRouter);
app.use("/api/v1/testimonials",testimonialRouter);
app.use("/api/v1/milestones",milestoneRouter);
export {app}
