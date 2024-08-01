import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { deleteGallery, getAllGallery, postGallery, updateGallery, updateGalleryContent } from "../controllers/gallery.controller.js";

const router  = Router();

router.route("/").get(getAllGallery)
router.route("/post").post(verifyJWT,upload.single("image"),postGallery)
router.route("/update-image/:id").patch(verifyJWT,upload.single("image"),updateGallery)
router.route("/update-content/:id").patch(verifyJWT,updateGalleryContent)
router.route("/delete/:id").delete(verifyJWT,deleteGallery)

export default router;