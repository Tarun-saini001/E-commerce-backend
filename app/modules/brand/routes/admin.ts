import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import BrandController from "../controllers/brand";
import { brand } from "../validations/brand";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(brand), BrandController.addBrand);
router.get("/", BrandController.getBrandList);
router.get("/:id", BrandController.getBrand);
router.delete("/:id", BrandController.deleteBrand);
router.put("/:id", Validator(brand), BrandController.updateBrand);

export default router;
