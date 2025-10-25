import { Router } from "express";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import Cms from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/", Cms.getCms);
router.get("/faq", Cms.listFaq);

export default router;