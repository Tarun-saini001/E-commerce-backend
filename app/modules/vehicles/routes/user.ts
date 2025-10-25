import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import { vehicle } from "../validation/vehicle";
import VehicleController from "../controllers/user";

const router = Router();
router.use(verify(USER_TYPES.USER))

router.get("/", VehicleController.getVehicleList);
router.get("/:id", VehicleController.getVehicle);
router.post("/:id", VehicleController.holdVehicle);

export default router;
