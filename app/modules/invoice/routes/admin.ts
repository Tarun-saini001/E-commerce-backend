import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { invoice } from "../validations/invoice";
import InvoiceController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/create", Validator(invoice), InvoiceController.createInvoice);
router.put("/:id", Validator(invoice), InvoiceController.updateInvoice);
router.get("/:id", InvoiceController.getInvoice);
router.get("/", InvoiceController.getInvoiceList);
router.delete("/:id", InvoiceController.deleteInvoice);

export default router;
