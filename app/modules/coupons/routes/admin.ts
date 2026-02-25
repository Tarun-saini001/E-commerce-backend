
import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import { addCoupon ,updateCoupon } from "../validations/coupon";
import admin from "../controllers/admin";

const router = Router();

router.post("/addCoupon",verify(USER_TYPES.ADMIN),Validator(addCoupon),admin.addCoupon)
router.patch("/updateCoupon/:id",verify(USER_TYPES.ADMIN),Validator(updateCoupon),admin.updateCoupon)
router.get("/couponsList",verify(USER_TYPES.ADMIN),admin.coupons)
export default router;