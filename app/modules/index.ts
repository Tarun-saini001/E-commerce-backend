import { Router } from "express"
import onboardingRoutes from "./onboarding/routes"
import mediaRoutes from "./media/routes"
import subadminRoutes from "./subadmin/routes"
import permissionRoutes from "./permissions/routes"
import settingRoutes from "./settings/routes"
import brandRoutes from "./brand/routes"
import categoryRoutes from "./category/routes"
import documentRoutes from "./documents/routes"
import cmsRoutes from "./cms/routes"
import vehicleRoutes from "./vehicles/routes"
import userRoutes from "./users/routes"
import addOnRoutes from "./addons/routes"
import customerSupportRoutes from "./customer_support/routes"

const router = Router()

router.use("/onboarding", onboardingRoutes);
router.use("/media", mediaRoutes);
router.use("/subadmin", subadminRoutes);
router.use("/permissions", permissionRoutes);
router.use("/settings", settingRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/documents", documentRoutes);
router.use("/cms", cmsRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/users", userRoutes);
router.use("/addons", addOnRoutes);
router.use("/customer-support", customerSupportRoutes);

export default router;