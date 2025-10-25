import { VEHICLE_STATUS } from "@app/config/constants";
import Vehicle from "@app/modules/vehicles/models/vehicles";
import Agenda from "agenda";

const releaseHoldVehicles = async (agenda: Agenda) => {
    agenda.define("release vehicle hold", async (job: any) => {
        const { vehicleId } = job.attrs.data as { vehicleId: string };

        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle && vehicle.status === VEHICLE_STATUS.HOLD) {
            vehicle.status = VEHICLE_STATUS.AVAILABLE;
            vehicle.hold = null;
            await vehicle.save();
            console.log(`Vehicle ${vehicleId} hold released automatically.`);
        }
    });
}

export default releaseHoldVehicles;
