import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { subscriptionPlan } from "../validations/subscriptionPlan";
import SubscriptionPlanController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(subscriptionPlan), SubscriptionPlanController.addPlan);
router.put("/:id", Validator(subscriptionPlan), SubscriptionPlanController.updatePlan);
router.get("/:id", SubscriptionPlanController.getPlan);
router.get("/", SubscriptionPlanController.getPlanList);
router.delete("/:id", SubscriptionPlanController.deletePlan);

export default router;
