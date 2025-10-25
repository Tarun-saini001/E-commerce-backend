import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { addon } from "../validations/addons";
import AddonController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(addon), AddonController.addAddon);
router.put("/:id", Validator(addon), AddonController.updateAddon);
router.get("/:id", AddonController.getAddon);
router.get("/", AddonController.getAddonList);
router.delete("/:id", AddonController.deleteAddon);

export default router;
