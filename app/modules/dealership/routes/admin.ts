import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { dealershipValidation } from "../validations/dealership";
import DealershipController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(dealershipValidation), DealershipController.addDealership);
router.get("/", DealershipController.getDealershipList);
router.get("/:id", DealershipController.getDealership);
router.delete("/:id", DealershipController.deleteDealership);
router.put("/:id", Validator(dealershipValidation), DealershipController.updateDealership);

export default router;
