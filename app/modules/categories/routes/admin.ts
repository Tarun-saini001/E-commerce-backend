import { Router } from "express";
import { addCategory,updateCategory } from "../validation/category";
import Validator from "@app/utils/validateRequest";
import admin from "../controllers/admin"; 


const router = Router();

router.post("/addCategory",Validator(addCategory),admin.addCategory);
router.get("/categoryList",admin.categoryList)
router.get("/getCategoryById/:id",admin.getCategoryById)
router.post("/updateCategory/:id",Validator(updateCategory),admin.updateCategory)
router.delete("/deleteCategory/:id",admin.deleteCategory)
export default router;