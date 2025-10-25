import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import {
    sendMessageSchema,
    supportSchema
} from "../validations/customerSupport";
import CustomerSupportController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN));

router.post("/add", Validator(supportSchema), CustomerSupportController.createTicket);
router.put("/:id", Validator(supportSchema), CustomerSupportController.updateTicket);
router.get("/:id", CustomerSupportController.getTicket);
router.get("/", CustomerSupportController.listTickets);
router.delete("/:id", CustomerSupportController.deleteTicket);
router.post("/:id/message", Validator(sendMessageSchema), CustomerSupportController.sendMessage);
router.delete("/:id/message/:messageId", CustomerSupportController.deleteMessage);

export default router;
