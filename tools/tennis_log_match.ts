// tools/tennis_log_match.ts

import {
  appendCsv,
  ensureCsv,
  MATCHES_CSV,
  MATCHES_HEADERS,
} from "../src/storage.ts";

const tool = {
  description:
    "Log a tennis match to the journal: opponent, result, score, surface, conditions, what worked, what did not, and opponent tendencies. Use whenever the user reports playing a tennis match.",
  defaultRiskLevel: "low" as const,
  input_schema: {
    type: "object",
    properties: {
      opponent: { type: "string", description: "Opponent's name or identifier." },
      result: { type: "string", enum: ["W", "L"], description: "W for a win, L for a loss." },
      score: { type: "string", description: "Set score, e.g. '6-4 3-6 7-5'." },
      surface: {
        type: "string",
        enum: ["hard", "clay", "grass", "carpet", "indoor_hard", "other"],
        description: "Court surface.",
      },
      conditions: {
        type: "string",
        description: "Playing conditions, e.g. 'windy', 'hot sun', 'indoor', 'night, cool'.",
      },
      duration_min: { type: "number", description: "Match length in minutes, if known." },
      what_worked: { type: "string", description: "What worked well, in the user's words." },
      what_didnt: { type: "string", description: "What did not work or broke down." },
      opponent_notes: {
        type: "string",
        description: "Opponent tendencies to remember: patterns, weaknesses, favorite plays.",
      },
      self_rating: {
        type: "number",
        description: "How well the user played, 1 (bad day) to 5 (peak).",
      },
      date: { type: "string", description: "Match date YYYY-MM-DD. Defaults to today." },
    },
    required: ["opponent", "result", "score"],
  },
  execute: async (input) => {
    const i = input as Record<string, unknown>;
    const date =
      typeof i.date === "string" && i.date
        ? i.date
        : new Date().toISOString().slice(0, 10);
    ensureCsv(MATCHES_CSV, MATCHES_HEADERS);
    appendCsv(MATCHES_CSV, [
      date,
      new Date().toISOString(),
      String(i.opponent ?? ""),
      String(i.result ?? ""),
      String(i.score ?? ""),
      String(i.surface ?? ""),
      String(i.conditions ?? ""),
      i.duration_min === undefined ? "" : Number(i.duration_min),
      String(i.what_worked ?? ""),
      String(i.what_didnt ?? ""),
      String(i.opponent_notes ?? ""),
      i.self_rating === undefined ? "" : Number(i.self_rating),
    ]);
    return {
      content: `Match logged: ${i.result} vs ${i.opponent}, ${i.score}${i.surface ? ` on ${i.surface}` : ""} (${date}).`,
      isError: false,
    };
  },
};

export default tool;
