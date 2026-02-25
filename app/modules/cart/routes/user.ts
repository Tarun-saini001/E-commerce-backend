import { Router } from "express";
import { addToCart } from "../validations/cart";
import Validator from "@app/utils/validateRequest";
import user from "../controllers/user"; 
import { optionalAuth } from "@app/middleware/optionalAuth";

const router = Router();

router.post("/cart/add",optionalAuth,Validator(addToCart),user.addToCart);
router.get("/getCart",optionalAuth,user.getCart)
router.post("/cart/update",optionalAuth,Validator(addToCart),user.updateCart)
router.post("/cart/merge",optionalAuth,user.mergeGuestCart)
export default router;