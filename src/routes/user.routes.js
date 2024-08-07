import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,changeCurrentUserPassword} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT,changeCurrentUserPassword)

export default router