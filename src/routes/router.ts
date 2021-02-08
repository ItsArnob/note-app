import { Router } from "express";
import viewsRouter from "./views.routes";

const router = Router();

router.use(viewsRouter);

export default router;