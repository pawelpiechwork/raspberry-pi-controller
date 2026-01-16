import { Router, Request, Response } from "express";
import * as activityService from "./activity.service";

const router = Router();

router.get("/", (_: Request, res: Response) => {
  const activities = activityService.getAll();
  res.json(activities);
});

router.delete("/", (_: Request, res: Response) => {
  const deletedCount = activityService.clearAll();
  res.json({ success: true, deletedCount });
});

export default router;
