import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { notification } from "../validations/notification";
import NotificationController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(notification), NotificationController.addNotification);
router.put("/:id/read", NotificationController.markAsRead);
router.get("/:id", NotificationController.getNotification);
router.get("/", NotificationController.getNotificationList);
router.delete("/:id", NotificationController.deleteNotification);

export default router;
