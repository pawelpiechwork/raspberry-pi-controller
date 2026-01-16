import { getAllActivity, clearAllActivity } from "../lib/db";
import type { ActivityResponse } from "./activity.types";

export const getAll = (): ActivityResponse[] => {
  const records = getAllActivity();

  return records.map((record) => ({
    id: record.id,
    datetime: record.datetime,
    roomId: record.room_id,
    roomName: record.room_name,
    newState: record.new_state,
    source: record.source,
  }));
};

export const clearAll = (): number => {
  return clearAllActivity();
};
