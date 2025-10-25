import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { appointment } from "../validations/appointment";
import AppointmentController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.post("/add", Validator(appointment), AppointmentController.addAppointment);
router.get("/:id", AppointmentController.getAppointment);
router.get("/", AppointmentController.getAppointmentList);

export default router;
