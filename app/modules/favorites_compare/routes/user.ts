import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { favorite } from "../validations/favorites_compare";
import FavoriteController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.post("/add", Validator(favorite), FavoriteController.add);
router.get("/", FavoriteController.list);
router.delete("/:id", FavoriteController.remove);

export default router;
