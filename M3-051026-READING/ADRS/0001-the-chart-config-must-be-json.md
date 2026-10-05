# 0001 — The chart config is JSON, so the axis unit went in the title

- **Status:** Accepted
- **Date:** 2026-10-05
- **Guarded by:** `check-charts.js` now warns on a function-valued option (plugin ADR 0020), with `tests/fixtures/charts-callbacks.html` as the fixture. No test guards this deck's specific chart.

## Context

The lateness trend is the slide the whole lesson turns on — Stage 1 shows it, Stage 2
questions it, Stage 6 returns to it. It is a line chart with three points: 44, 41, 44.

The first version set the y-axis ticks to print percentages with a Chart.js callback:

```json
"ticks": { "stepSize": 10, "callback": "function(value) { return value + '%'; }" }
```

**This did not work, and nothing said so.** The reveal.js chart plugin reads each
`<canvas>` comment with a plain `JSON.parse`, so the string is not a function; and
Chart.js does not evaluate the string form either. The option was dropped, the axis
printed `0 10 20 30 40 50`, and every check passed — `check-charts.js` reported the
chart `OK` and `check-overflow.js` reported all 18 slides clean. The deck looked
finished and rendered without error. The defect was found by looking at the slide.

Two further facts shaped the fix, both from `PISA-reading-data-2000-2025.md`:

- **The lateness figure barely moves, and that is the entire point of the slide.**
  Up 2, down 3, back to 44 — "about 4 in every 10 students, every time". A reader who
  sees three numbers on a bare axis has to do that arithmetic themselves.
- **The OECD comparison must not appear.** The source note is explicit: do not print
  the OECD column, do not compare against it in speech.

## Decision

1. **The unit lives in the axis `title`, not in a tick callback.** `"title": { "display": true, "text": "% arriving late" }`. This is JSON, so it survives; and it states the unit once rather than repeating `%` on six ticks.
2. **A dashed reference line holds the 2018 figure flat across the chart** — a second dataset at `[44, 44, 44]`, `pointRadius: 0`, `borderDash: [7, 6]`, `fill: false`, in translucent maroon. **The flatness becomes visible instead of inferred**, which is what Stage 1 asks students to notice.
3. **The three figures are repeated as large stat cards** below the chart, so the numbers the teacher is about to build the shape from are on screen and legible from the back of the room.
4. **`beginAtZero` with `max: 50`.** A trend chart could be zoomed to 40–45 to exaggerate the movement, and that would invert the lesson: the slide exists to show that the movement is negligible. The full 0–50 scale is the honest framing.
5. **Legend and tooltip disabled** — neither is usable on a projected slide, and the dashed line is explained in the footnote instead.
6. **Thailand only.** The OECD average is deliberately absent.

The two `%` facts — the axis title and the stat cards — are now in two shapes, so the
chart is readable even if one is missed.

## Consequences

- **The axis is labelled and the flat line is explicit**, so Stage 1's "look only, in
  silence" produces the intended observation rather than a question about units.
- **The footnote carries the source and explains the dashed line:** *"Source: OECD,
  PISA 2025 Results Volume I — country note for Thailand. The dashed line holds the
  2018 figure flat, for reference."* A dashed line with no explanation is a puzzle.
- **The trap is now caught mechanically, and documented.** `check-charts.js` warns on
  a function string, and `references/charts.md` plus the skill body tell the next
  author to put the unit in the title. This deck is the measurement that justified
  (plugin ADR 0020).
- **`?export` disables chart animation** for PDF and screenshot runs, so a chart is
  measured at its final size rather than mid-animation (plugin ADR 0005).

## What breaks if you change this

- **Reinstate the callback.** It parses, it renders, and the axis silently loses its
  unit again — the exact defect this record exists to prevent. `check-charts.js` now
  warns, but a warning is not a gate.
- **Put the OECD average on the slide.** It contradicts the source note, and it moves
  the lesson onto a national comparison the plan deliberately removed. Two people
  disagreed about this before the note was written; the note settles it.
- **Add the reading-score trend.** Same reason, and the note is blunt: *"Do not
  reintroduce it."*
- **Zoom the y-axis to 40–45.** It makes a flat line look like a climb, which reverses
  what the slide teaches.
- **Drop the stat cards.** The three numbers are what the teacher elicits in Stage 1
  and returns to in Stage 6; they should not depend on reading a chart from a
  distance.
