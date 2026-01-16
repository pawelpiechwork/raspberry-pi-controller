import { Router, Request, Response } from "express";
import * as lightsService from "./lights.service";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_: Request, res: Response) => {
  const lights = await lightsService.getAll();
  res.json(lights);
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const light = await lightsService.getById(id);

  if (!light) {
    logger.warn({ id }, "Light not found");
    res.status(404).json({ error: "Light not found", id });
    return;
  }

  res.json(light);
});

router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { state } = req.body;

  if (state !== 0 && state !== 1) {
    res.status(400).json({ error: "State must be 0 or 1", received: state });
    return;
  }

  const result = await lightsService.setState(id, state);

  if (!result) {
    logger.warn({ id }, "Light not found");
    res.status(404).json({ error: "Light not found", id });
    return;
  }

  res.json(result);
});

router.patch("/:id/config", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { name, pin, buttonPin, color } = req.body;

  const updates: { name?: string; pin?: number; buttonPin?: number; color?: string } = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "Name must be a non-empty string" });
      return;
    }
    updates.name = name.trim();
  }

  if (pin !== undefined) {
    if (typeof pin !== "number" || !Number.isInteger(pin) || pin < 0) {
      res.status(400).json({ error: "Pin must be a non-negative integer" });
      return;
    }
    updates.pin = pin;
  }

  if (buttonPin !== undefined) {
    if (typeof buttonPin !== "number" || !Number.isInteger(buttonPin) || buttonPin < 0) {
      res.status(400).json({ error: "ButtonPin must be a non-negative integer" });
      return;
    }
    updates.buttonPin = buttonPin;
  }

  if (color !== undefined) {
    if (typeof color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(color)) {
      res.status(400).json({ error: "Color must be a valid hex color (e.g. #ff0000)" });
      return;
    }
    updates.color = color;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "At least one field (name, pin, buttonPin, color) must be provided" });
    return;
  }

  try {
    const result = lightsService.updateConfig(id, updates);

    if (!result) {
      logger.warn({ id }, "Light not found");
      res.status(404).json({ error: "Light not found", id });
      return;
    }

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error({ id, error: message }, "Failed to update light config");
    res.status(409).json({ error: message });
  }
});

export default router;
