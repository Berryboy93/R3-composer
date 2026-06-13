import { Router, type IRouter } from "express";
import healthRouter from "./health";
import composerRouter from "./composer";

const router: IRouter = Router();

router.use(healthRouter);
router.use(composerRouter);

export default router;
