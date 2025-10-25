import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import { subAdmin } from "../validation/subadmin";
import SubAdmin from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(subAdmin), SubAdmin.addSubAdmin);
router.get("/", SubAdmin.getSubAdminList);
router.get("/:id", SubAdmin.getSubAdmin);
router.delete("/:id", SubAdmin.deleteSubAdmin);
router.put("/:id", Validator(subAdmin), SubAdmin.updateSubAdmin);

export default router;
