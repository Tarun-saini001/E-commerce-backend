import { Router } from "express";
import AdminRoutes from './admin';

const router = Router();

router.use('/', AdminRoutes);

export default router;