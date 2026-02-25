import { Router } from "express";
import { addToCart } from "../validations/cart";
import Validator from "@app/utils/validateRequest";
import admin from "../controllers/admin"; 
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { optionalAuth } from "@app/middleware/optionalAuth";

const router = Router();

router.post("/cart/add",verify(USER_TYPES.ADMIN),Validator(addToCart),admin.addToCart);
router.get("/getCart",optionalAuth,admin.getCart)
router.post("/cart/update",optionalAuth,Validator(addToCart),admin.updateCart)
router.post("/cart/merge",optionalAuth,admin.mergeGuestCart)

export default router;