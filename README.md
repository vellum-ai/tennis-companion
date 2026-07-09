# tennis-companion

A Vellum assistant plugin for tennis players: match journal, drill session builder, court finder, and progress tracking.

## What it does

- **Match journal** — log matches with opponent, result, score, surface, conditions, what worked, what did not, and opponent tendencies. Scouting notes resurface before rematches.
- **Drill sessions** — tell it what you are working on (serve, backhand, net play, footwork, consistency) and get a structured session (default 30 minutes): warmup, main drills with progressions, match-play finisher. Built from a 25-drill curated library across 8 categories and 3 levels.
- **Court finder** — search nearby tennis courts through OpenStreetMap (no API key). Returns distance, surface, lighting, access, and a map link.
- **Progress tracking** — win rate overall and by surface/conditions, streaks, recent form, self-rating trend, head-to-head records, and practice focus breakdown.

## Tools

| Tool | What it does |
| --- | --- |
| `tennis_log_match` | Append a match to the journal |
| `tennis_drill_session` | Generate and log a structured practice session |
| `tennis_find_courts` | Find courts near a location |
| `tennis_progress` | Stats, streaks, trends, head-to-head |

## How to use

Once installed, just talk to your assistant. No commands to memorize.

**Log a match:**

Tell your assistant about the match and it goes into the journal:

- "played Sasha today, won 6-4 6-3 on the hard courts, windy as hell"
- "lost to Jamie 4-6 6-7 on clay. my second serve fell apart but the slice was working"

The more you mention, the richer the journal: surface, conditions, what
worked, what broke down, and anything you noticed about the opponent
("she can't handle high balls to the backhand"). Rate your own play 1-5
if you want a form trend over time.

**Get a practice session:**

Tell it what you want to work on and how long you have:

- "give me a 30 minute serve session"
- "45 minutes to work on backhand and net play"
- "I only have 20 minutes and my footwork is trash"

You get a timed plan: warmup, main drills matched to your level with a
progression for when each one gets easy, and a match-play finisher.
Sessions are logged to practice history automatically.

**Find courts:**

- "where can I play tennis near Williamsburg?"
- "any courts with lights within 5k of me?"

Results include distance, surface, number of courts, lighting, whether
access is private or free, and a map link.

**Check your progress:**

- "how's my tennis going?" gets win rate, streak, recent form, splits by
  surface and conditions, and your practice focus breakdown
- "what's my record against Sasha?" gets the head-to-head with your
  scouting notes from previous matches, useful right before a rematch
- "what should I practice?" and the assistant looks at what broke down
  in your recent matches and builds a session around it

## Install

```
assistant plugins install tennis-companion
```

Or directly from GitHub:

```
assistant plugins install https://github.com/vellum-ai/tennis-companion
```

## Config

`config.json` in the plugin directory:

```json
{
  "defaultLocation": "Williamsburg, Brooklyn",
  "skillLevel": "intermediate",
  "sessionMinutes": 30
}
```

## Data

CSV files in the plugin storage dir, portable and grep-able:

- `matches.csv` — the match journal
- `sessions.csv` — drill session history

## Notes

Court data comes from OpenStreetMap (Nominatim + Overpass). Coverage is community-maintained; if your local courts are missing, add them to OSM and everyone benefits.
