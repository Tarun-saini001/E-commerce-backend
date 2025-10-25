import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { transaction } from "../validations/transaction";
import TransactionController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.post("/add", Validator(transaction), TransactionController.addTransaction);
router.get("/:id", TransactionController.getTransaction);
router.get("/", TransactionController.getTransactionList);

export default router;
