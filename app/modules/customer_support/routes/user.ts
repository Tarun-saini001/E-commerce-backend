import { Router } from "express";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import AddonController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/:id", AddonController.getAddon);
router.get("/", AddonController.getAddonList);

export default router;
