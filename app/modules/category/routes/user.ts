import { Router } from "express";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import CategoryController from "../controllers/category";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/", CategoryController.getCategoryList);
router.get("/:id", CategoryController.getCategory);

export default router;
