# 0007 — Chart slides: question on top, axis text for a projector, and a legend built in HTML

- **Status:** Accepted
- **Date:** 2026-10-06
- **Guarded by:** a browser probe that measures each rendered x-axis label against the tick spacing (so "it fits" is arithmetic, not a look), and confirms `autoSkip: false` kept all seven years. `check-charts.js` and `check-overflow.js` pass on 19 slides. **Nothing guards that the axis text stays large** — a later edit can shrink it back and every gate still passes.

## Context

The teacher reviewed the projected deck and made four points, three of them
defects:

1. **"What is this graph communicating?" was at the bottom** of slide 2, under
   the chart. It reads as a caption of the chart rather than as the prompt it is,
   and the eye meets the data before the question.
2. **The axis text was unreadable.** It was set at **16–18 px** — a size chosen
   for a printed page, on a slide projected across a room. *"This is a slideshow,
   not a PDF, it has to be readable."*
3. **The source line was microscopic and not wanted.** At `--footnote-size` 11pt
   it was the smallest thing on the slide and unreadable from any distance, so it
   bought no transparency and cost legibility.
4. **Add a Thai flag and a readable legend** carrying the series description:
   *"Thai 15-year-olds reporting they arrived late for school in the two weeks
   before the test."*

## Decision

1. **The question is the slide's `<h2>`, at the top, on every chart slide.** Both
   chart slides are now structurally identical: question, legend, chart.
2. **Axis text is sized for a projector**: x ticks **26–30 px**, y ticks **28 px**,
   axis title **26 px** — roughly double what it was.
3. **No source line is printed on a chart slide.** The citation is not lost: it
   lives in [0005](0005-the-reading-trend-returns-with-its-limits-stated.md) and
   in `PISA-reading-data-2000-2025.md`, which is the source of record. This
   deliberately departs from the rule that a slide cites the report and its
   publication date — a citation a class cannot read serves nobody, and the
   provenance is one ADR away.
4. **The legend is built in HTML, not by Chart.js.** This is forced, and it is the
   same constraint as [0001](0001-the-chart-config-must-be-json.md): a Chart.js
   legend can only draw a flag or a dash pattern through a `generateLabels`
   function or an image `pointStyle` — **and the chart plugin parses its config
   with `JSON.parse`, so a function is silently dropped.** An HTML legend also
   makes the text a readable size and lets it carry the comparability caveat,
   which a Chart.js legend cannot.
5. **The Thai flag is inline SVG, not an image file.** It is exact, needs no
   network, adds no binary, raises no licence question, and scales. Five bands at
   **1:1:2:1:1** — red `#A51931`, white `#F4F5F8`, blue `#2D2A4A` at double
   height. It carries a hairline `--card-border`, because white stripes on a
   near-white page are invisible without one.
6. **`autoSkip: false` on the x axis**, because a dropped year on a twenty-year
   trend is a silent falsehood rather than a cosmetic compromise.

## Consequences

- Measured at reveal scale 1 on a 1280×720 viewport:

  | | lateness chart | reading chart |
  | --- | --- | --- |
  | x ticks | 30 px | 26 px |
  | y ticks / axis title | 28 / 26 px | 28 / 26 px |
  | years drawn | 3 | **7** (none skipped) |
  | widest x label vs tick spacing | 67 px vs 346 px | 58 px vs 147 px |
  | canvas | 1160 × 482 | 1160 × 494 |

  Every label fits with room to spare, so the text roughly doubled without a
  label colliding or a year disappearing.
- **The reading chart's comparability caveat moved into the legend** — *"OECD
  average — each cycle's own country set"* — at a readable size, which is where
  it belongs: it explains the dashes right next to them.
- The only `.footnote` left in the deck is the title slide's Pixabay credit for
  the alarm clock, which is an attribution requirement rather than a source
  citation and is not on a chart slide.
- **The flags are 78×52 and 60×40 px**, sized to sit beside 20pt legend text.

## What breaks if you change this

- **Put the question back below the chart.** It becomes a caption, and the class
  reads the data with no question in mind — which is what this record fixes.
- **Shrink the axis text toward the old 16 px.** It looks fine on the monitor you
  are editing on and is unreadable projected; nothing in the toolchain fails.
- **Re-add a source line.** It will be 11pt again, and unreadable again. If a
  citation must be visible, it belongs at legend size — but the place for
  provenance is the ADR, not the slide.
- **Try to put the flag in the Chart.js legend.** The `generateLabels` function
  is dropped by `JSON.parse` with no error, and the legend silently loses its
  swatch. This is [0001](0001-the-chart-config-must-be-json.md)'s trap in a new
  place.
- **Drop `autoSkip: false`.** Chart.js may then skip years to make room, and a
  twenty-year trend will quietly show five of them.
- **Remove the flag's border.** On the near-white page the white bands vanish and
  the flag reads as a red-and-blue stripe.
