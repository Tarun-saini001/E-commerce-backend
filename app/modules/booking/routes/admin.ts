import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { booking } from "../validations/booking";
import BookingController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN))

router.post("/add", Validator(booking), BookingController.addBooking);
router.put("/:id", BookingController.updateBooking);
router.get("/:id", BookingController.getBooking);
router.get("/", BookingController.getBookingList);
router.delete("/:id", BookingController.deleteBooking);

export default router;
