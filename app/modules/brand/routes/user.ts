import { Router } from "express";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import BrandController from "../controllers/brand";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/", BrandController.getBrandList);
router.get("/:id", BrandController.getBrand);

export default router;
