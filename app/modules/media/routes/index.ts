import { Router } from "express";
import Media from "../controllers/media";
import { upload } from "@app/utils/upload"
const router = Router();

router.post('/', upload.single("file"), Media.Upload)

export default router