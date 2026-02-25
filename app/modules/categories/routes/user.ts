import { Router } from "express";
import { addCategory } from "../validation/category";
import Validator from "@app/utils/validateRequest";
import user from "../controllers/user"; 

const router = Router();
router.get("/categoryList",user.categoryList)
router.get("/getCategoryById/:id",user.getCategoryById)

export default router;