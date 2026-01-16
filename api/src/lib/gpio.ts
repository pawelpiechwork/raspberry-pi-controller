import { execa } from "execa";

const CHIP = "gpiochip0";

type PinProcess = { pin: number; process: ReturnType<typeof execa> };
type ButtonWatcher = { pin: number; process: ReturnType<typeof execa> };

const pinProcesses: PinProcess[] = [];
const buttonWatchers: ButtonWatcher[] = [];
const outputCache = new Map<number, 0 | 1>();

export const gpioGet = async (pin: number): Promise<0 | 1> => {
  // If we have this pin in cache (we're holding it), return cached value
  if (outputCache.has(pin)) {
    return outputCache.get(pin)!;
  }
  const { stdout } = await execa`gpioget --chip ${CHIP} ${pin}`;
  return String(stdout).trim() === "1" ? 1 : 0;
};

export const gpioSet = async (pin: number, value: 0 | 1): Promise<0 | 1> => {
  const existingIndex = pinProcesses.findIndex((p) => p.pin === pin);
  if (existingIndex !== -1) {
    pinProcesses[existingIndex].process.kill("SIGTERM");
    pinProcesses.splice(existingIndex, 1);
  }

  const setter = execa`gpioset --chip ${CHIP} ${`${pin}=${value}`}`;

  // gpioset is expected to be killed on state change – ignore SIGTERM errors
  setter.catch((err: { isTerminated?: boolean }) => {
    if (err?.isTerminated) return;
    console.error("gpioset failed", err);
  });

  pinProcesses.push({ pin, process: setter });
  outputCache.set(pin, value);

  return value;
};

export const killAllGpio = async (): Promise<void> => {
  await execa`pkill gpioset`.catch(() => {});
  await execa`pkill gpiomon`.catch(() => {});
};

export const initPins = async (pins: number[]): Promise<void> => {
  await Promise.all(pins.map((pin) => gpioSet(pin, 0)));
};

export const watchButton = (pin: number, onPress: () => void): void => {
  if (buttonWatchers.some((w) => w.pin === pin)) return;

  const watcher = execa`gpiomon -c ${CHIP} -e rising -b pull-down -p 50ms ${pin}`;

  watcher.stdout?.on("data", (chunk: string | Uint8Array) => {
    if (String(chunk).trim()) onPress();
  });

  buttonWatchers.push({ pin, process: watcher });
};
