import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { appointment } from "../validations/appointment";
import AppointmentController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(appointment), AppointmentController.addAppointment);
router.put("/:id", Validator(appointment), AppointmentController.updateAppointment);
router.get("/:id", AppointmentController.getAppointment);
router.get("/", AppointmentController.getAppointmentList);
router.delete("/:id", AppointmentController.deleteAppointment);

export default router;
