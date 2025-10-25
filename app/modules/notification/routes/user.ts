import { Router } from "express";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import NotificationController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.put("/:id/read", NotificationController.markAsRead);
router.get("/:id", NotificationController.getNotification);
router.get("/", NotificationController.getNotificationList);
router.delete("/:id", NotificationController.deleteNotification);

export default router;
