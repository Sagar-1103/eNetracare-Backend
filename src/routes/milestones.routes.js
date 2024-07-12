import { Router } from "express";
import { verifyJWT,verifyAdmin } from "../middlewares/auth.middleware.js";
import { deleteMilestone, getAllMilestones, postMilestone, updateMilestoneContent } from "../controllers/milestone.controller.js";

const router  = Router();

router.route("/").get(getAllMilestones)
router.route("/post").post(verifyJWT,verifyAdmin,postMilestone)
router.route("/update-content/:id").patch(verifyJWT,verifyAdmin,updateMilestoneContent)
router.route("/delete/:id").delete(verifyJWT,verifyAdmin,deleteMilestone)

export default router;