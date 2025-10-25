import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { verify } from "@app/middleware/checkRole";
import { USER_TYPES } from "@app/config/constants";
import { booking } from "../validations/booking";
import BookingController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.post("/add", Validator(booking), BookingController.addBooking);
router.get("/:id", BookingController.getBooking);
router.get("/", BookingController.getBookingList);

export default router;
