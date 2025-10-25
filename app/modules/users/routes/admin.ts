import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import UserController from "../controllers/admin";
import { updateProfile } from "@app/modules/onboarding/validation/onboarding";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(updateProfile), UserController.addUser);
router.put("/:id", Validator(updateProfile), UserController.updateUser);
router.get("/:id", UserController.getUser);
router.get("/", UserController.getUserList);
router.delete("/:id", UserController.deleteUser);
router.get("/export/csv", UserController.exportUserCsv);

export default router;
