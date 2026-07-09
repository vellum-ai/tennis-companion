// tools/tennis_drill_session.ts
import type { ToolDefinition } from "@vellumai/plugin-api";
import { buildSession, parseFocus, CATEGORIES } from "../src/drills.ts";
import {
  appendCsv,
  ensureCsv,
  getConfig,
  SESSIONS_CSV,
  SESSIONS_HEADERS,
} from "../src/storage.ts";

const tool: ToolDefinition = {
  description:
    "Generate a structured tennis drill session (default 30 minutes) for a chosen focus like serve, backhand, net play, footwork, or consistency. Includes warmup, main drills with progressions, and a match-play finisher. Logs the session to practice history.",
  parameters: {
    type: "object",
    properties: {
      focus: {
        type: "string",
        description:
          "What to work on, free text: 'serve', 'backhand and net play', 'footwork', 'consistency', etc.",
      },
      minutes: { type: "number", description: "Total session length in minutes. Default 30." },
      level: {
        type: "string",
        enum: ["beginner", "intermediate", "advanced"],
        description: "Player level. Defaults to the configured skillLevel.",
      },
      log: {
        type: "boolean",
        description: "Whether to log this session to practice history. Default true.",
      },
    },
    required: ["focus"],
  },
  execute: async (input) => {
    const i = input as Record<string, unknown>;
    const cfg = getConfig<{ skillLevel?: string; sessionMinutes?: number }>();
    const minutes = Number(i.minutes) > 0 ? Number(i.minutes) : (cfg.sessionMinutes ?? 30);
    const level = typeof i.level === "string" ? i.level : (cfg.skillLevel ?? "intermediate");
    const focus = parseFocus(String(i.focus ?? ""));
    const blocks = buildSession(focus, minutes, level);

    const lines: string[] = [
      `${minutes}-minute session, focus: ${focus.join(" + ")} (${level})`,
      "",
    ];
    let t = 0;
    for (const b of blocks) {
      const label =
        b.phase === "warmup" ? "Warmup" : b.phase === "finisher" ? "Finisher" : b.drill?.name ?? "Drill";
      const setup = b.drill ? ` [${b.drill.setup}]` : "";
      lines.push(`${t}-${t + b.minutes} min | ${label}${setup}`);
      lines.push(`  ${b.note}`);
      lines.push("");
      t += b.minutes;
    }
    lines.push(`Categories available: ${CATEGORIES.join(", ")}`);

    if (i.log !== false) {
      ensureCsv(SESSIONS_CSV, SESSIONS_HEADERS);
      appendCsv(SESSIONS_CSV, [
        new Date().toISOString().slice(0, 10),
        new Date().toISOString(),
        focus.join("+"),
        minutes,
        blocks.filter((b) => b.drill).map((b) => b.drill!.id).join(";"),
        "",
      ]);
    }

    return { content: lines.join("\n"), isError: false };
  },
};

export default tool;
