import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import { category } from "../validation/category";
import CategoryController from "../controllers/category";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(category), CategoryController.addCategory);
router.get("/", CategoryController.getCategoryList);
router.get("/:id", CategoryController.getCategory);
router.delete("/:id", CategoryController.deleteCategory);
router.put("/:id", Validator(category), CategoryController.updateCategory);

export default router;
