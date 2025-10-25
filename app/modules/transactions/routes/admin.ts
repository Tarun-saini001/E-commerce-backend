import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { transaction } from "../validations/transaction";
import TransactionController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(transaction), TransactionController.addTransaction);
router.put("/:id", TransactionController.updateTransaction);
router.get("/:id", TransactionController.getTransaction);
router.get("/", TransactionController.getTransactionList);
router.delete("/:id", TransactionController.deleteTransaction);

export default router;
