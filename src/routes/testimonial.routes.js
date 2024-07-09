import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTestimonial, getAllTestimonials, postTestimonial, updatePatientImage, updateTestimonialContent } from "../controllers/testimonial.controller.js";

const router = Router();

router.route("/").get(getAllTestimonials)
router.route("/post").post(verifyJWT,upload.single("image"),postTestimonial)
router.route("/update-image/:id").patch(verifyJWT,upload.single("image"),updatePatientImage)
router.route("/update-content/:id").patch(verifyJWT,updateTestimonialContent)
router.route("/delete/:id").delete(verifyJWT,deleteTestimonial)

export default router;