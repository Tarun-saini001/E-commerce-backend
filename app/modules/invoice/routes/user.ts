import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { invoice } from "../validations/invoice";
import InvoiceController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.post("/create", Validator(invoice), InvoiceController.createInvoice);
router.get("/:id", InvoiceController.getInvoice);
router.get("/", InvoiceController.getInvoiceList);

export default router;
