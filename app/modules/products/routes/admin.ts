import { Router } from "express";
import { addProduct,updateBundleOfferValidation,updateProduct } from "../validation/product";
import Validator from "@app/utils/validateRequest";
import admin from "../controllers/admin"; 


const router = Router();

router.post("/addProduct",Validator(addProduct),admin.addProduct);
router.get("/productList",admin.productList)
router.get("/getProductById/:id",admin.getProductById)
router.post("/updateProduct/:id",Validator(updateProduct),admin.updateProduct)
router.post("/updateBundleOffer",Validator(updateBundleOfferValidation),admin.updateBundleOffer)
router.delete("/deleteProduct/:id",admin.deleteProduct)
export default router;