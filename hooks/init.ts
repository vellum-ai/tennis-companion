// hooks/init.ts
import type { InitContext } from "@vellumai/plugin-api";
import {
  setDataDir,
  setConfig,
  ensureCsv,
  MATCHES_CSV,
  MATCHES_HEADERS,
  SESSIONS_CSV,
  SESSIONS_HEADERS,
} from "../src/storage.ts";

export default async function init(ctx: InitContext): Promise<void> {
  setDataDir(ctx.pluginStorageDir);
  setConfig(ctx.config);
  ensureCsv(MATCHES_CSV, MATCHES_HEADERS);
  ensureCsv(SESSIONS_CSV, SESSIONS_HEADERS);
  ctx.logger?.info?.("tennis-companion: initialized");
}
