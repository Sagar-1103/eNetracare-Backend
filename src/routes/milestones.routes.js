import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteMilestone, getAllMilestones, postMilestone, updateMilestoneContent } from "../controllers/milestone.controller.js";

const router  = Router();

router.route("/").get(getAllMilestones)
router.route("/post").post(verifyJWT,postMilestone)
router.route("/update-content/:id").patch(verifyJWT,updateMilestoneContent)
router.route("/delete/:id").delete(verifyJWT,deleteMilestone)

export default router;