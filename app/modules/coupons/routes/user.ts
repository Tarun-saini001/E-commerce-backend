
import { Router } from "express";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import user from "../controllers/user";

const router = Router();

router.post("/applyCoupon",verify(USER_TYPES.USER),user.applyCoupon)
router.post("/removeCoupon",verify(USER_TYPES.USER),user.removeCoupon)
export default router;