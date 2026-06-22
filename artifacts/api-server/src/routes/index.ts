import { Router, type IRouter } from "express";
import healthRouter from "./health";
import composerRouter from "./composer";
import generateRouter from "./generate";
import projectsRouter from "./projects";
import exportsRouter from "./exports";
import copilotRouter from "./copilot";

const router: IRouter = Router();

router.use(healthRouter);
router.use(composerRouter);
router.use(generateRouter);
router.use(projectsRouter);
router.use(exportsRouter);
router.use(copilotRouter);

export default router;
