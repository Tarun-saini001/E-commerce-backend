import { Router } from "express";
import Validator from "@app/utils/validateRequest";
import { USER_TYPES } from "@app/config/constants";
import { verify } from "@app/middleware/checkRole";
import { vehicle } from "../validation/vehicle";
import VehicleController from "../controllers/admin";

const router = Router();
router.use(verify(USER_TYPES.ADMIN));

router.post("/add", Validator(vehicle), VehicleController.addVehicle);
router.get("/", VehicleController.getVehicleList);
router.get("/:id", VehicleController.getVehicle);
router.delete("/:id", VehicleController.deleteVehicle);
router.put("/:id", Validator(vehicle), VehicleController.updateVehicle);
router.post("/:id", VehicleController.holdVehicle);
router.post("/:id", VehicleController.releaseVehicleHold);

export default router;
