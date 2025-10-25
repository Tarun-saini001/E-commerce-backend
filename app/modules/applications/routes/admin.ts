import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { applicationSchema } from "../validations/applilcation";
import ApplicationController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(applicationSchema), ApplicationController.addApplication);
router.put("/:id/status", ApplicationController.updateApplicationStatus);
router.get("/", ApplicationController.getApplicationList);
router.get("/:id", ApplicationController.getApplication);
router.delete("/:id", ApplicationController.deleteApplication);
router.post("/:id/counter-price", ApplicationController.counterPrice);
router.post("/:id/documents", ApplicationController.addDocument);
router.delete("/:id/documents/:fileId", ApplicationController.removeDocument);
router.put("/:id/documents/:fileId/status", ApplicationController.updateDocumentStatus);
router.post("/:id/message", ApplicationController.sendMessage);

export default router;
