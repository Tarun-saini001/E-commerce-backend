import { Router } from "express";
import { addProduct } from "../validation/product";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";

import user from "../controllers/user"; 
import { USER_TYPES } from "@app/config/constants";

const router = Router();
router.get("/productList",user.productList)
router.get("/getProductById/:id",user.getProductById)
router.post("/addToWishList",verify(USER_TYPES.USER),user.addToWishList)
router.get("/getWishlist",verify(USER_TYPES.USER),user.getWishlist)
export default router;