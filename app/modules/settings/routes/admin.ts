import { Router } from "express";
import { verify } from "@app/middleware/checkRole";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { settings } from "../validations/settings";
import Settings from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/settings", Validator(settings), Settings.addSettings);
router.get("/settings", Settings.getSettings);

export default router;