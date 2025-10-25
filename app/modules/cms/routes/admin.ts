import { Router } from "express";
import { verify } from "@app/middleware/checkRole";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { addCms, addFaq, editFaq } from "../validations/cms";
import Cms from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.put("/", Validator(addCms), Cms.addCms);
router.get("/", Cms.getCms);
router.post("/faq", Validator(addFaq), Cms.addFaq);
router.get("/faq", Cms.listFaq);
router.get("/faq/:id", Cms.getFaq);
router.put("/faq/:id", Validator(editFaq), Cms.editFaq);
router.delete("/faq/:id", Cms.deleteFaq);

export default router;