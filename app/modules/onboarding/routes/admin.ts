import { Router } from "express";
import {
    login,
    sendOtp,
    verifyOtp,
    changePassword,
    updateProfile,
} from "../validation/onboarding";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import Onboarding from "../controllers/admin";

const router = Router();
/**
 * @swagger
 * /onboarding/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Onboarding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", Validator(login), Onboarding.login);
router.post("/send-otp", Validator(sendOtp), Onboarding.sendOtp);
router.post("/verify-otp", Validator(verifyOtp), Onboarding.verifyOtp);
router.post("/verify/send-otp", Validator(sendOtp), verify(USER_TYPES.ADMIN), Onboarding.sendOtpToVerify);
router.post("/verify/verify-otp", Validator(verifyOtp), Onboarding.verifyOtpToVerify);
router.put("/update", verify(USER_TYPES.ADMIN), Validator(updateProfile), Onboarding.update);
router.post("/change-password", verify(USER_TYPES.ADMIN), Validator(changePassword), Onboarding.changePassword);
router.get("/", verify(USER_TYPES.ADMIN), Onboarding.getProfile);
router.get("/logout", verify(USER_TYPES.ADMIN), Onboarding.logout);

export default router;
