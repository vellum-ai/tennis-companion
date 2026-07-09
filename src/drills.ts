// src/drills.ts
// Curated drill library and 30-minute session builder.
// Levels: beginner | intermediate | advanced. "all" fits any level.
// Setup: solo (wall/serve basket), partner, or coach-fed basket.

export interface Drill {
  id: string;
  name: string;
  category: Category;
  level: "beginner" | "intermediate" | "advanced" | "all";
  minutes: number;
  setup: "solo" | "partner" | "basket";
  description: string;
  progression: string;
}

export type Category =
  | "serve"
  | "return"
  | "forehand"
  | "backhand"
  | "net"
  | "footwork"
  | "consistency"
  | "match_play";

export const CATEGORIES: Category[] = [
  "serve",
  "return",
  "forehand",
  "backhand",
  "net",
  "footwork",
  "consistency",
  "match_play",
];

export const DRILLS: Drill[] = [
  // ---- serve ----
  { id: "srv-targets", name: "Target Serving", category: "serve", level: "all", minutes: 10, setup: "solo",
    description: "Place cones (or towels) in the T, body, and wide zones of each service box. Serve 10 balls per target, both boxes. Score 1 point per hit, track your total.",
    progression: "Shrink targets to a racquet-head size, or call the target out loud BEFORE the toss so you commit." },
  { id: "srv-second", name: "Second-Serve Pressure", category: "serve", level: "intermediate", minutes: 8, setup: "solo",
    description: "Serve only second serves. You get one ball per point; a miss is a double fault. Play a ghost game to 10 points against the fault count.",
    progression: "Add a consequence: every double fault restarts the game at 0. Builds real match nerves." },
  { id: "srv-toss", name: "Toss Consistency", category: "serve", level: "beginner", minutes: 5, setup: "solo",
    description: "Lay your racquet on the ground in front of your lead foot. Toss 20 balls aiming to land them on the strings. No swing, just the toss.",
    progression: "Toss with eyes tracking a fixed point above; then integrate a slow-motion full service motion, catching the ball at contact height." },
  { id: "srv-plus-one", name: "Serve +1", category: "serve", level: "advanced", minutes: 10, setup: "basket",
    description: "Serve, then immediately play an aggressive first ball fed to the middle of the court. Trains the serve as the start of a pattern, not an isolated shot.",
    progression: "Pre-decide the pattern (wide serve then open-court forehand) and only count the point if you executed the plan." },

  // ---- return ----
  { id: "ret-blocks", name: "Block Returns", category: "return", level: "all", minutes: 8, setup: "partner",
    description: "Partner serves at 80%; you return with a compact block, no backswing, aiming deep middle. 20 returns per side. Goal: depth past the service line.",
    progression: "Partner serves at full pace, or you call the return direction (cross/line) before the serve is struck." },
  { id: "ret-split", name: "Split-Step Timing", category: "return", level: "beginner", minutes: 5, setup: "partner",
    description: "Focus only on the split-step as the server strikes. Land as the ball leaves their strings. Return quality does not matter, timing does.",
    progression: "Add a first-step direction call: split, read, and say 'forehand' or 'backhand' out loud before moving." },
  { id: "ret-attack", name: "Attack the Second Serve", category: "return", level: "advanced", minutes: 8, setup: "partner",
    description: "Partner hits only second serves. Step inside the baseline and return aggressively to a pre-chosen target. Track aggressive returns in vs errors.",
    progression: "Follow the return to net and finish the point in two shots or fewer." },

  // ---- forehand ----
  { id: "fh-crosscourt", name: "Crosscourt Rally Ladder", category: "forehand", level: "all", minutes: 10, setup: "partner",
    description: "Forehand crosscourt only. Ladder scoring: rally of 4 = 1 pt, 8 = 2 pts, 12 = 3 pts. First to 10 points. Miss resets the ladder.",
    progression: "Only balls landing beyond the service line count toward the rally." },
  { id: "fh-insideout", name: "Inside-Out Forehand", category: "forehand", level: "intermediate", minutes: 8, setup: "basket",
    description: "Feed to the backhand corner; run around and hit inside-out forehands to the deuce corner. 3 sets of 10. Focus on footwork to create space.",
    progression: "Alternate inside-out and inside-in on command, called mid-feed." },
  { id: "fh-wall", name: "Wall Tempo Forehands", category: "forehand", level: "beginner", minutes: 8, setup: "solo",
    description: "Against a wall, hit forehands above a target line at steady tempo. Sets of 20 without a miss. Compact swing, full recovery step between shots.",
    progression: "Alternate one forehand, one backhand, keeping the same tempo." },

  // ---- backhand ----
  { id: "bh-crosscourt", name: "Backhand Crosscourt Grind", category: "backhand", level: "all", minutes: 10, setup: "partner",
    description: "Backhand crosscourt only, target the last 6 feet of the court. Rally goal: 3 rallies of 10+. Count depth hits out loud.",
    progression: "Add the down-the-line change: every 5th backhand goes up the line, then recover crosscourt." },
  { id: "bh-slice", name: "Slice Depth Control", category: "backhand", level: "intermediate", minutes: 8, setup: "partner",
    description: "Slice backhands only, aiming to land every ball past the service line with low bounce. 20 balls, count how many stay deep AND low.",
    progression: "Mix one drive for every two slices to disguise the change-up." },
  { id: "bh-high", name: "High Ball Backhands", category: "backhand", level: "advanced", minutes: 8, setup: "basket",
    description: "Feeds land shoulder-height to the backhand. Choose: take it early on the rise, or back up and drive. 3 sets of 8, commit to the choice before the bounce.",
    progression: "All takes on the rise, moving forward through contact." },

  // ---- net ----
  { id: "net-volley-volley", name: "Volley-to-Volley", category: "net", level: "all", minutes: 6, setup: "partner",
    description: "Both players inside the service line, volley to each other with soft hands. Rally goal 20. No swinging, just blocking and redirecting.",
    progression: "One player retreats to no-man's land and hits half-volleys while the other stays tight to net." },
  { id: "net-approach", name: "Approach and Finish", category: "net", level: "intermediate", minutes: 10, setup: "basket",
    description: "Short ball fed, hit an approach down the line, close in, then a volley feed, then an overhead feed. 10 full sequences. Approach, volley, smash.",
    progression: "Partner plays the point out live after the approach instead of set feeds." },
  { id: "net-reflex", name: "Reflex Volleys", category: "net", level: "advanced", minutes: 5, setup: "partner",
    description: "You at net, partner at the baseline drives balls at you at pace. Just get strings on everything. 3 rounds of 10.",
    progression: "Partner aims at your body; work the elbow-out backhand block on jam balls." },

  // ---- footwork ----
  { id: "ft-spider", name: "Spider Run", category: "footwork", level: "all", minutes: 5, setup: "solo",
    description: "Place 5 balls on the corners and center of the service boxes. Sprint from the center hash, retrieve one ball at a time back to center. Time each round, 3 rounds.",
    progression: "Shadow a full stroke at each ball pickup point before sprinting back." },
  { id: "ft-figure8", name: "Figure-8 Recovery", category: "footwork", level: "beginner", minutes: 5, setup: "solo",
    description: "Shadow-swing corner to corner in a figure-8: sprint, plant, swing, crossover-step recover through the center. 30 seconds on, 30 off, 4 rounds.",
    progression: "Hold a medicine ball or add a resistance band around the waist." },
  { id: "ft-firststep", name: "First-Step Explosion", category: "footwork", level: "intermediate", minutes: 5, setup: "partner",
    description: "Partner points left or right randomly; you split-step and explode two steps that way, then recover. 3 sets of 10 reactions.",
    progression: "Partner uses voice only (no pointing) so you react to sound, or drops a ball you must catch after one bounce." },

  // ---- consistency ----
  { id: "con-100", name: "100-Ball Rally", category: "consistency", level: "all", minutes: 10, setup: "partner",
    description: "Cooperative rally to 100 total shots, any stroke, 70% pace. Count out loud. A miss restarts the count. Deceptively hard, brutally effective.",
    progression: "All 100 must land beyond the service line, or restrict to crosscourt lanes only." },
  { id: "con-depth", name: "Depth Zones", category: "consistency", level: "intermediate", minutes: 8, setup: "partner",
    description: "Divide the court at the service line. Rally where balls landing short give your opponent a point, deep balls give you one. First to 15.",
    progression: "Shrink the deep zone to the final 4 feet of the court." },
  { id: "con-wall-control", name: "Wall Control Circuit", category: "consistency", level: "beginner", minutes: 8, setup: "solo",
    description: "Against a wall: 20 forehands, 20 backhands, 20 alternating, 10 volleys. Ball must stay above the net line every hit. Restart the set on a miss.",
    progression: "Add a target square on the wall and count only square hits." },

  // ---- match play ----
  { id: "mp-2ahead", name: "Win by Two", category: "match_play", level: "all", minutes: 10, setup: "partner",
    description: "Play points from a serve; game goes to whoever leads by 2 points. Forces you to close out tight moments over and over.",
    progression: "Start every game down 0-1 so you always play from behind." },
  { id: "mp-pattern", name: "Pattern Lock", category: "match_play", level: "advanced", minutes: 10, setup: "partner",
    description: "Play points but you must follow a declared pattern for the first 3 shots (e.g. serve wide, forehand to open court, approach). Point only counts if the pattern held.",
    progression: "Opponent knows your pattern and defends it; make it work anyway." },
  { id: "mp-tiebreak", name: "Tiebreak Reps", category: "match_play", level: "intermediate", minutes: 10, setup: "partner",
    description: "Play back-to-back 7-point tiebreaks. Between points, use a fixed reset ritual (breathe, strings, plan). Track tiebreaks won across sessions.",
    progression: "Start each tiebreak 2-4 down and climb out." },
];

export interface SessionBlock {
  phase: "warmup" | "main" | "finisher";
  drill?: Drill;
  minutes: number;
  note: string;
}

const WARMUP_NOTE =
  "Dynamic warmup: jog the baseline, side shuffles, arm circles, then mini-tennis inside the service boxes building to full court.";

/** Build a session from focus categories, total minutes, and level. */
export function buildSession(
  focus: Category[],
  totalMinutes: number,
  level: string,
): SessionBlock[] {
  const lvl = ["beginner", "intermediate", "advanced"].includes(level)
    ? level
    : "intermediate";
  const rank = { beginner: 0, intermediate: 1, advanced: 2 } as const;
  const fits = (d: Drill) =>
    d.level === "all" ||
    Math.abs(rank[d.level] - rank[lvl as keyof typeof rank]) <= 1;

  const warmup = Math.max(4, Math.round(totalMinutes * 0.15));
  const finisher = totalMinutes >= 25 ? Math.max(5, Math.round(totalMinutes * 0.2)) : 0;
  let mainBudget = totalMinutes - warmup - finisher;

  const blocks: SessionBlock[] = [
    { phase: "warmup", minutes: warmup, note: WARMUP_NOTE },
  ];

  // Round-robin across focus categories, exact-level drills first.
  const pools = focus.map((cat) =>
    DRILLS.filter((d) => d.category === cat && fits(d)).sort((a, b) => {
      const aExact = a.level === lvl ? 0 : 1;
      const bExact = b.level === lvl ? 0 : 1;
      return aExact - bExact;
    }),
  );
  const used = new Set<string>();
  let poolIdx = 0;
  let safety = 32;
  while (mainBudget >= 5 && safety-- > 0) {
    const pool = pools[poolIdx % pools.length];
    poolIdx++;
    const drill = pool.find((d) => !used.has(d.id) && d.minutes <= mainBudget + 2);
    if (!drill) {
      if (pools.every((p) => p.every((d) => used.has(d.id) || d.minutes > mainBudget + 2)))
        break;
      continue;
    }
    used.add(drill.id);
    const mins = Math.min(drill.minutes, mainBudget);
    blocks.push({
      phase: "main",
      drill,
      minutes: mins,
      note: `${drill.description} Progression when it feels easy: ${drill.progression}`,
    });
    mainBudget -= mins;
  }

  if (finisher > 0) {
    const mp = DRILLS.filter(
      (d) => d.category === "match_play" && fits(d) && !used.has(d.id),
    )[0];
    blocks.push({
      phase: "finisher",
      drill: mp,
      minutes: finisher + Math.max(0, mainBudget),
      note: mp
        ? `${mp.description}`
        : "Play out points applying today's focus. End on a made shot.",
    });
  }

  return blocks;
}

/** Loose text -> category mapping so users can say "net play" or "groundstrokes". */
export function parseFocus(input: string): Category[] {
  const t = input.toLowerCase();
  const out = new Set<Category>();
  if (/serv/.test(t)) out.add("serve");
  if (/return/.test(t)) out.add("return");
  if (/forehand|fh\b/.test(t)) out.add("forehand");
  if (/backhand|bh\b|slice/.test(t)) out.add("backhand");
  if (/net|volley|overhead|smash|approach/.test(t)) out.add("net");
  if (/footwork|movement|speed|agilit/.test(t)) out.add("footwork");
  if (/consist|rally|control|depth/.test(t)) out.add("consistency");
  if (/match|point|pressure|mental|tiebreak/.test(t)) out.add("match_play");
  if (/groundstroke/.test(t)) {
    out.add("forehand");
    out.add("backhand");
  }
  if (out.size === 0) {
    out.add("consistency");
    out.add("match_play");
  }
  return [...out];
}
