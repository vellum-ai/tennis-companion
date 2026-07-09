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
