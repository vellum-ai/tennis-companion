// tools/tennis_progress.ts

import { readCsvObjects, MATCHES_CSV, SESSIONS_CSV } from "../src/storage.ts";

function pct(w: number, n: number): string {
  return n === 0 ? "-" : `${Math.round((w / n) * 100)}%`;
}

const tool = {
  description:
    "Show tennis progress from the match journal and practice history: win rate overall, by surface and conditions, current streak, recent form, per-opponent records, and practice focus breakdown. Use when the user asks how their tennis is going.",
  defaultRiskLevel: "low" as const,
  input_schema: {
    type: "object",
    properties: {
      opponent: {
        type: "string",
        description: "Optional: show head-to-head record and notes for this opponent only.",
      },
      last_n: {
        type: "number",
        description: "Optional: limit stats to the most recent N matches.",
      },
    },
    required: [],
  },
  execute: async (input) => {
    const i = input as Record<string, unknown>;
    let matches = readCsvObjects(MATCHES_CSV);
    const sessions = readCsvObjects(SESSIONS_CSV);

    if (!matches.length && !sessions.length) {
      return {
        content:
          "No matches or practice sessions logged yet. Log a match with tennis_log_match or run a drill session to get started.",
        isError: false,
      };
    }

    matches.sort((a, b) => (a.date < b.date ? -1 : 1));

    // Head-to-head mode
    const opp = String(i.opponent ?? "").trim().toLowerCase();
    if (opp) {
      const vs = matches.filter((m) => m.opponent.toLowerCase().includes(opp));
      if (!vs.length) {
        return { content: `No matches logged against '${i.opponent}'.`, isError: false };
      }
      const w = vs.filter((m) => m.result === "W").length;
      const lines = [
        `vs ${vs[vs.length - 1].opponent}: ${w}-${vs.length - w} (${pct(w, vs.length)})`,
        "",
        ...vs.map(
          (m) =>
            `${m.date} ${m.result} ${m.score}${m.surface ? ` [${m.surface}]` : ""}${m.opponent_notes ? ` | notes: ${m.opponent_notes}` : ""}`,
        ),
      ];
      const latestNotes = [...vs].reverse().find((m) => m.opponent_notes);
      if (latestNotes) lines.push("", `Latest scouting notes: ${latestNotes.opponent_notes}`);
      return { content: lines.join("\n"), isError: false };
    }

    if (Number(i.last_n) > 0) matches = matches.slice(-Number(i.last_n));

    const wins = matches.filter((m) => m.result === "W").length;
    const lines: string[] = [
      `Record: ${wins}-${matches.length - wins} (${pct(wins, matches.length)} win rate, ${matches.length} matches)`,
    ];

    // Streak + form
    let streak = 0;
    const last = matches[matches.length - 1]?.result;
    for (let k = matches.length - 1; k >= 0 && matches[k].result === last; k--) streak++;
    if (matches.length) {
      lines.push(
        `Current streak: ${streak}${last} | Last 5: ${matches.slice(-5).map((m) => m.result).join(" ")}`,
      );
    }

    // By surface
    const bySurface = new Map<string, { w: number; n: number }>();
    const byCond = new Map<string, { w: number; n: number }>();
    for (const m of matches) {
      if (m.surface) {
        const s = bySurface.get(m.surface) ?? { w: 0, n: 0 };
        s.n++;
        if (m.result === "W") s.w++;
        bySurface.set(m.surface, s);
      }
      if (m.conditions) {
        const c = byCond.get(m.conditions) ?? { w: 0, n: 0 };
        c.n++;
        if (m.result === "W") c.w++;
        byCond.set(m.conditions, c);
      }
    }
    if (bySurface.size) {
      lines.push(
        "By surface: " +
          [...bySurface.entries()]
            .map(([s, v]) => `${s} ${v.w}-${v.n - v.w} (${pct(v.w, v.n)})`)
            .join(" | "),
      );
    }
    if (byCond.size) {
      lines.push(
        "By conditions: " +
          [...byCond.entries()]
            .map(([c, v]) => `${c} ${v.w}-${v.n - v.w} (${pct(v.w, v.n)})`)
            .join(" | "),
      );
    }

    // Self-rating trend
    const rated = matches.filter((m) => m.self_rating);
    if (rated.length >= 2) {
      const half = Math.floor(rated.length / 2);
      const avg = (arr: typeof rated) =>
        arr.reduce((s, m) => s + Number(m.self_rating), 0) / arr.length;
      lines.push(
        `Self-rating trend: ${avg(rated.slice(0, half)).toFixed(1)} -> ${avg(rated.slice(half)).toFixed(1)} (first half vs recent)`,
      );
    }

    // Opponents
    const byOpp = new Map<string, { w: number; n: number }>();
    for (const m of matches) {
      const o = byOpp.get(m.opponent) ?? { w: 0, n: 0 };
      o.n++;
      if (m.result === "W") o.w++;
      byOpp.set(m.opponent, o);
    }
    if (byOpp.size) {
      lines.push(
        "Opponents: " +
          [...byOpp.entries()]
            .sort((a, b) => b[1].n - a[1].n)
            .slice(0, 8)
            .map(([o, v]) => `${o} ${v.w}-${v.n - v.w}`)
            .join(" | "),
      );
    }

    // Practice
    if (sessions.length) {
      const focusCount = new Map<string, number>();
      let practiceMin = 0;
      for (const s of sessions) {
        practiceMin += Number(s.minutes) || 0;
        for (const f of (s.focus || "").split("+")) {
          if (f) focusCount.set(f, (focusCount.get(f) ?? 0) + 1);
        }
      }
      lines.push(
        `Practice: ${sessions.length} sessions, ${practiceMin} min total. Focus breakdown: ` +
          [...focusCount.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([f, n]) => `${f} x${n}`)
            .join(", "),
      );
    }

    return { content: lines.join("\n"), isError: false };
  },
};

export default tool;
