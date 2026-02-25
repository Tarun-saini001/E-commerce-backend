import { Router } from "express";
import { addBrand,updateBrand } from "../validation/brand";
import Validator from "@app/utils/validateRequest";
import admin from "../controllers/admin"; 


const router = Router();

router.post("/addBrand",Validator(addBrand),admin.addBrand);
router.get("/brandList",admin.brandList)
router.get("/getBrandById/:id",admin.getBrandById)
router.post("/updateBrand/:id",Validator(updateBrand),admin.updateBrand)
router.delete("/deleteBrand/:id",admin.deleteBrand)
export default router;