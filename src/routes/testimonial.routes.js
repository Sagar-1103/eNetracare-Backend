import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT ,verifyAdmin} from "../middlewares/auth.middleware.js";
import { deleteTestimonial, getAllTestimonials, postTestimonial, updatePatientImage, updateTestimonialContent } from "../controllers/testimonial.controller.js";

const router = Router();

router.route("/").get(getAllTestimonials)
router.route("/post").post(verifyJWT,verifyAdmin,upload.single("image"),postTestimonial)
router.route("/update-image/:id").patch(verifyJWT,verifyAdmin,upload.single("image"),updatePatientImage)
router.route("/update-content/:id").patch(verifyJWT,verifyAdmin,updateTestimonialContent)
router.route("/delete/:id").delete(verifyJWT,verifyAdmin,deleteTestimonial)

export default router;