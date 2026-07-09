---
name: tennis-companion
description: Tennis journal, drill sessions, court finder, and progress tracking. Use when the user talks about playing tennis, wants practice drills, asks where to play, or wants to review their tennis stats.
---

# Tennis Companion

Four tools, one habit loop: play, log, review, train.

## Tools

- **tennis_log_match** — log a match the moment the user mentions playing one. Capture opponent, result, score, surface, conditions, what worked, what did not, and opponent tendencies. Ask for missing high-value fields (surface, what worked) at most once; log with what you have rather than interrogating.
- **tennis_drill_session** — build a structured practice session (default 30 min) from a focus like "serve" or "backhand and net play". Each drill includes a progression for when it gets easy. Sessions are logged to practice history automatically.
- **tennis_find_courts** — find nearby courts via OpenStreetMap. Needs a location (or a configured defaultLocation in config.json).
- **tennis_progress** — win rate overall and by surface/conditions, streaks, recent form, self-rating trend, per-opponent head-to-head with scouting notes, and practice focus breakdown.

## Behavior

- Before a rematch against a logged opponent, proactively surface their scouting notes with tennis_progress (opponent parameter).
- When the user says they are heading to practice with no plan, offer a drill session for whatever broke down in their last match (check tennis_progress first).
- Log matches without judgment or unsolicited coaching. Save analysis for when the user asks.

## Data

CSV files in the plugin data dir: matches.csv (journal) and sessions.csv (practice history). Config in config.json: defaultLocation, skillLevel (beginner/intermediate/advanced), sessionMinutes.
