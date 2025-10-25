import { Router } from "express";
import SubscriptionPlanController from "../controllers/admin";

const router = Router();

router.get("/:id", SubscriptionPlanController.getPlan);
router.get("/", SubscriptionPlanController.getPlanList);

export default router;
