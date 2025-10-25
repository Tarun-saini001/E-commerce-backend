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
import Onboarding from "../controllers/user";

const router = Router();

router.post("/login", Validator(login), Onboarding.login);
router.post("/send-otp", Validator(sendOtp), Onboarding.sendOtp);
router.post("/verify-otp", Validator(verifyOtp), Onboarding.verifyOtp);
router.post("/verify/send-otp", Validator(sendOtp), verify(USER_TYPES.USER), Onboarding.sendOtpToVerify);
router.post("/verify/verify-otp", verify(USER_TYPES.USER), Validator(verifyOtp), Onboarding.verifyOtpToVerify);
router.put("/update", verify(USER_TYPES.USER), Validator(updateProfile), Onboarding.update);
router.post("/change-password", verify(USER_TYPES.USER), Validator(changePassword), Onboarding.changePassword);
router.get("/", verify(USER_TYPES.USER), Onboarding.getProfile);
router.get("/logout", verify(USER_TYPES.USER), Onboarding.logout);

export default router;
