import express, { Request, Response, NextFunction } from "express";
import { killAllGpio, initPins } from "./lib/gpio";
import { logger } from "./lib/logger";
import { initDb } from "./lib/db";
import lightsController from "./lights/lights.controller";
import activityController from "./activity/activity.controller";
import { startButtonMonitor, getLightPins } from "./lights/lights.service";

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      { method: req.method, url: req.url, status: res.statusCode, duration: `${duration}ms` },
      "request",
    );
  });
  next();
});

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/lights", lightsController);
app.use("/activity", activityController);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, async () => {
  logger.info({ port: PORT }, "Server started");

  initDb();
  logger.info("Database initialized");

  await killAllGpio();
  logger.info("Killed all existing gpioset/gpiomon processes");

  const lightPins = getLightPins();
  await initPins(lightPins);
  logger.info({ pins: lightPins }, "All light pins initialized to 0");

  startButtonMonitor();
});
