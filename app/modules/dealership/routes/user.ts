import { Router } from "express";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import DealershipController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/", DealershipController.getDealershipList);
router.get("/:id", DealershipController.getDealership);

export default router;
