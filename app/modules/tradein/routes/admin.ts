import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { tradeIn } from "../validations/tradein";
import TradeInController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(tradeIn), TradeInController.addTradeIn);
router.put("/:id", TradeInController.updateTradeIn);
router.get("/:id", TradeInController.getTradeIn);
router.get("/", TradeInController.getTradeInList);
router.delete("/:id", TradeInController.deleteTradeIn);

export default router;
