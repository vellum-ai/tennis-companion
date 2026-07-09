// src/storage.ts
// CSV-backed storage for match journal and drill session history.
// Works both in-process (init hook sets the data dir) and standalone
// (falls back to <pluginDir>/data). Same pattern as fitness-companion
// and plant-doctor.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const PLUGIN_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const DEFAULT_DATA_DIR = path.join(PLUGIN_DIR, "data");
const CONFIG_PATH = path.join(PLUGIN_DIR, "config.json");

let dataDir = "";
let pluginConfig: unknown = null;
let configLoaded = false;

export function setDataDir(dir: string): void {
  dataDir = dir;
}

export function getDataDir(): string {
  return dataDir || DEFAULT_DATA_DIR;
}

export function setConfig(config: unknown): void {
  pluginConfig = config;
  configLoaded = true;
}

export function getConfig<T = Record<string, unknown>>(): T {
  if (!configLoaded) {
    try {
      pluginConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    } catch {
      pluginConfig = null;
    }
    configLoaded = true;
  }
  return (pluginConfig ?? {}) as T;
}

export const MATCHES_CSV = "matches.csv";
export const SESSIONS_CSV = "sessions.csv";

export const MATCHES_HEADERS = [
  "date",
  "timestamp",
  "opponent",
  "result",
  "score",
  "surface",
  "conditions",
  "duration_min",
  "what_worked",
  "what_didnt",
  "opponent_notes",
  "self_rating",
];

export const SESSIONS_HEADERS = [
  "date",
  "timestamp",
  "focus",
  "minutes",
  "drills",
  "notes",
];

function csvEscape(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function ensureCsv(filename: string, headers: string[]): void {
  const dir = getDataDir();
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, headers.join(",") + "\n");
  }
}

export function appendCsv(
  filename: string,
  values: (string | number | null | undefined)[],
): void {
  const dir = getDataDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(
    path.join(dir, filename),
    values.map(csvEscape).join(",") + "\n",
  );
}

/** Minimal CSV parser handling quoted fields with embedded commas/quotes/newlines. */
export function readCsv(filename: string): string[][] {
  const filepath = path.join(getDataDir(), filename);
  if (!fs.existsSync(filepath)) return [];
  const text = fs.readFileSync(filepath, "utf-8");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

/** Read CSV as objects keyed by header row. Returns [] if only headers exist. */
export function readCsvObjects(filename: string): Record<string, string>[] {
  const rows = readCsv(filename);
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? "";
    });
    return obj;
  });
}
