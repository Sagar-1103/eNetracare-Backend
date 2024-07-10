import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteNews, getAllNews, postNews, updateNewsContent, updateNewsCoverImage } from "../controllers/news.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router  = Router();

router.route("/").get(getAllNews)
router.route("/post").post(verifyJWT,upload.single("image"),postNews)
router.route("/update-image/:id").patch(verifyJWT,upload.single("image"),updateNewsCoverImage)
router.route("/update-content/:id").patch(verifyJWT,updateNewsContent)
router.route("/delete/:id").delete(verifyJWT,deleteNews)

export default router;