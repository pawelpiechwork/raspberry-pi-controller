import { gpioGet, gpioSet, watchButton } from "../lib/gpio";
import { logger } from "../lib/logger";
import { insertActivity, getAllLightsConfig, updateLightConfig, type LightConfig, type LightConfigUpdate } from "../lib/db";
import type { LightResponse, LightSetResponse, LightConfigResponse } from "./lights.types";

const CHIP = "gpiochip0";

const getLights = (): LightConfig[] => {
  return getAllLightsConfig();
};

export const getAll = async (): Promise<LightResponse[]> => {
  const lights = getLights();

  return Promise.all(
    lights.map(async (config) => {
      const raw = await gpioGet(config.pin);
      const state = config.activeLow ? (raw === 0 ? 1 : 0) : raw;

      return {
        id: config.id,
        name: config.name,
        pin: config.pin,
        buttonPin: config.buttonPin,
        chip: CHIP,
        color: config.color,
        state,
      };
    }),
  );
};

export const getById = async (id: string): Promise<LightResponse | null> => {
  const lights = getLights();
  const light = lights.find((l) => l.id === id);

  if (!light) {
    return null;
  }

  const raw = await gpioGet(light.pin);
  const state = light.activeLow ? (raw === 0 ? 1 : 0) : raw;

  return {
    id: light.id,
    name: light.name,
    pin: light.pin,
    buttonPin: light.buttonPin,
    chip: CHIP,
    color: light.color,
    state,
  };
};

export const setState = async (id: string, state: 0 | 1): Promise<LightSetResponse | null> => {
  const lights = getLights();
  const light = lights.find((l) => l.id === id);

  if (!light) {
    return null;
  }

  const writeValue = light.activeLow ? (state === 1 ? 0 : 1) : state;

  logger.info({ id: light.id, pin: light.pin, state, writeValue }, "GPIO write");
  await gpioSet(light.pin, writeValue as 0 | 1);

  const raw = await gpioGet(light.pin);
  const actualState = light.activeLow ? (raw === 0 ? 1 : 0) : raw;

  insertActivity({
    roomId: light.id,
    roomName: light.name,
    newState: actualState as 0 | 1,
    source: "api",
  });

  return {
    id: light.id,
    name: light.name,
    pin: light.pin,
    buttonPin: light.buttonPin,
    chip: CHIP,
    color: light.color,
    state: actualState,
    success: actualState === state,
  };
};

export const startButtonMonitor = (): void => {
  const lights = getLights();

  for (const config of lights) {
    watchButton(config.buttonPin, async () => {
      const raw = await gpioGet(config.pin);
      const current = config.activeLow ? (raw === 0 ? 1 : 0) : raw;
      const next = current === 1 ? 0 : 1;
      const writeValue = config.activeLow ? (next === 1 ? 0 : 1) : next;
      await gpioSet(config.pin, writeValue as 0 | 1);
      logger.info({ id: config.id, pin: config.pin, from: current, to: next }, "Button toggled light");

      insertActivity({
        roomId: config.id,
        roomName: config.name,
        newState: next as 0 | 1,
        source: "button",
      });
    });
  }
  logger.info({ totalMonitors: lights.length }, "All button monitors started");
};

export const getLightPins = (): number[] => {
  const lights = getLights();
  return lights.map((l) => l.pin);
};

export const updateConfig = (id: string, updates: LightConfigUpdate): LightConfigResponse | null => {
  const result = updateLightConfig(id, { name: updates.name });

  if (!result) {
    return null;
  }

  logger.info({ id, updates }, "Light config updated");

  return {
    id: result.id,
    name: result.name,
    pin: result.pin,
    buttonPin: result.buttonPin,
    color: result.color,
    activeLow: result.activeLow,
  };
};
