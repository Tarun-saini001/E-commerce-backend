import { Router } from "express";
import Settings from "../controllers/user";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/listing", Settings.getSettings);

export default router;