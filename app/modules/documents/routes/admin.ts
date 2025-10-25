import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { documentSchema } from "../validations/documents";
import DocumentController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(documentSchema), DocumentController.addDocuments);
router.put("/:id", Validator(documentSchema), DocumentController.updateDocument);
router.get("/:id", DocumentController.getDocument);
router.get("/", DocumentController.getDocumentList);
router.delete("/:id", DocumentController.deleteDocument);

export default router;
