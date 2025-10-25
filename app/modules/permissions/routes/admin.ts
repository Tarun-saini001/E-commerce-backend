import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import Permissions from "../controllers/admin";
import { PermissionSchema } from "../validation/permissions";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(PermissionSchema), Permissions.addPermission);
router.get("/", Permissions.getPermissionList);
router.get("/:id", Permissions.getPermission);
router.delete("/:id", Permissions.deletePermission);
router.put("/:id", Validator(PermissionSchema), Permissions.updatePermission);

export default router;
