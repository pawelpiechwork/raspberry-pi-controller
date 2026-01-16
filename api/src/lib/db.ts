import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "..", "sqlite3.db");

const db = new Database(DB_PATH);

db.pragma("foreign_keys = ON");

export const initDb = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lights_config (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      pin INTEGER NOT NULL UNIQUE,
      button_pin INTEGER NOT NULL UNIQUE,
      color TEXT NOT NULL,
      active_low INTEGER NOT NULL
    );

    INSERT OR IGNORE INTO lights_config (id, name, pin, button_pin, color, active_low) VALUES
      ('salon', '🛋️ Salon', 17, 26, '#0958d9', 1),
      ('kuchnia', '🔪 Kuchnia', 27, 19, '#ffc53d', 1),
      ('sypialnia', '🛏️ Sypialnia', 22, 13, '#7cb305', 1),
      ('lazienka', '🧼 Łazienka', 23, 6, '#cf1322', 1),
      ('biuro', '🖥️ Biuro', 24, 5, '#ffc53d', 1);
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      datetime TEXT NOT NULL,
      room_id TEXT NOT NULL,
      room_name TEXT NOT NULL,
      new_state INTEGER NOT NULL,
      source TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES lights_config(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_activity_datetime ON activity_history(datetime DESC)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_activity_room_id ON activity_history(room_id)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_activity_source ON activity_history(source)
  `);
};

export type ActivityRecord = {
  id: number;
  datetime: string;
  room_id: string;
  room_name: string;
  new_state: 0 | 1;
  source: "api" | "button";
};

export type InsertActivityParams = {
  roomId: string;
  roomName: string;
  newState: 0 | 1;
  source: "api" | "button";
};

export const insertActivity = (params: InsertActivityParams): void => {
  const stmt = db.prepare(`
    INSERT INTO activity_history (datetime, room_id, room_name, new_state, source)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(new Date().toISOString(), params.roomId, params.roomName, params.newState, params.source);
};

export const getAllActivity = (): ActivityRecord[] => {
  const stmt = db.prepare(`
    SELECT id, datetime, room_id, room_name, new_state, source
    FROM activity_history
    ORDER BY datetime DESC
  `);
  return stmt.all() as ActivityRecord[];
};

export const clearAllActivity = (): number => {
  const stmt = db.prepare(`DELETE FROM activity_history`);
  const result = stmt.run();
  return result.changes;
};

export type LightConfigRecord = {
  id: string;
  name: string;
  pin: number;
  button_pin: number;
  color: string;
  active_low: number;
};

export type LightConfig = {
  id: string;
  name: string;
  pin: number;
  buttonPin: number;
  color: string;
  activeLow: boolean;
};

export const getAllLightsConfig = (): LightConfig[] => {
  const stmt = db.prepare(`
    SELECT id, name, pin, button_pin, color, active_low
    FROM lights_config
  `);
  const records = stmt.all() as LightConfigRecord[];

  return records.map((r) => ({
    id: r.id,
    name: r.name,
    pin: r.pin,
    buttonPin: r.button_pin,
    color: r.color,
    activeLow: r.active_low === 1,
  }));
};

export const getLightsConfigCount = (): number => {
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM lights_config`);
  const result = stmt.get() as { count: number };
  return result.count;
};

export const seedLightsConfig = (lights: LightConfig[]): void => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO lights_config (id, name, pin, button_pin, color, active_low)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const light of lights) {
    stmt.run(light.id, light.name, light.pin, light.buttonPin, light.color, light.activeLow ? 1 : 0);
  }
};

export type LightConfigUpdate = {
  name?: string;
};

export const updateLightConfig = (id: string, updates: LightConfigUpdate): LightConfig | null => {
  const current = db.prepare(`SELECT * FROM lights_config WHERE id = ?`).get(id) as LightConfigRecord | undefined;

  if (!current) {
    return null;
  }

  const newName = updates.name ?? current.name;

  db.prepare(`
    UPDATE lights_config
    SET name = ?
    WHERE id = ?
  `).run(newName, id);

  return {
    id,
    name: newName,
    pin: current.pin,
    buttonPin: current.button_pin,
    color: current.color,
    activeLow: current.active_low === 1,
  };
};

export const getLightConfigById = (id: string): LightConfig | null => {
  const record = db.prepare(`SELECT * FROM lights_config WHERE id = ?`).get(id) as LightConfigRecord | undefined;

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    pin: record.pin,
    buttonPin: record.button_pin,
    color: record.color,
    activeLow: record.active_low === 1,
  };
};

export default db;
