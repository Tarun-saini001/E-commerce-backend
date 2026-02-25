import { Router } from "express"
import onboardingRoutes from "./onboarding/routes"
import mediaRoutes from "./media/routes"
import subadminRoutes from "./subadmin/routes"
import permissionRoutes from "./permissions/routes"
import settingRoutes from "./settings/routes"
import categoryRoutes from "./categories/routes"
import brandRoutes from "./brands/routes"
import productRoutes from "./products/routes"
import cartRoutes from "./cart/routes"
import couponRoutes from "./coupons/routes"

const router = Router()

router.use("/onboarding", onboardingRoutes);
router.use("/media", mediaRoutes);
router.use("/subadmin", subadminRoutes);
router.use("/permissions", permissionRoutes);
router.use("/settings", settingRoutes);
router.use("/categories",categoryRoutes)
router.use("/brands",brandRoutes)
router.use("/products",productRoutes)
router.use("/cart",cartRoutes)
router.use("/coupon",couponRoutes)

export default router;