import { Router } from "express";
import AdminRoutes from "./admin"
import UserRoutes from './user';

const router = Router();

router.use('/admin', AdminRoutes);
router.use('/user', UserRoutes);

export default router;