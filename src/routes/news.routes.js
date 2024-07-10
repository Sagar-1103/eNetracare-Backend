import { Router } from "express";
import { verifyJWT,verifyAdmin} from "../middlewares/auth.middleware.js";
import { deleteNews, getAllNews, postNews, updateNewsContent, updateNewsCoverImage } from "../controllers/news.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router  = Router();

router.route("/").get(getAllNews)
router.route("/post").post(verifyJWT,verifyAdmin,upload.single("image"),postNews)
router.route("/update-image/:id").patch(verifyJWT,verifyAdmin,upload.single("image"),updateNewsCoverImage)
router.route("/update-content/:id").patch(verifyJWT,verifyAdmin,updateNewsContent)
router.route("/delete/:id").delete(verifyJWT,verifyAdmin,deleteNews)

export default router;