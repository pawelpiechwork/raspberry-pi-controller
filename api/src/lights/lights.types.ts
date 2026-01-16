export type LightConfig = {
  id: string;
  name: string;
  pin: number;
  buttonPin: number;
  color: string;
  activeLow: boolean;
};

export type LightResponse = {
  id: string;
  name: string;
  pin: number;
  buttonPin: number;
  chip: string;
  color: string;
  state: 0 | 1;
};

export type LightSetResponse = LightResponse & {
  success: boolean;
};

export type LightConfigUpdateRequest = {
  name?: string;
  pin?: number;
  buttonPin?: number;
  color?: string;
};

export type LightConfigResponse = {
  id: string;
  name: string;
  pin: number;
  buttonPin: number;
  color: string;
  activeLow: boolean;
};
