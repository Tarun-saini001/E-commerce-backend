import { Router } from "express";
import AdminRoutes from './admin';

const router = Router();

router.use('/admin', AdminRoutes);

export default router;