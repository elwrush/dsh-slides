# Architecture decision records — M3-051026-READING

These record decisions about **this deck**: its data interpretation, its layout
repairs, and how it stays self-contained. The plugin's own decisions — how it is
packaged, registered, and how its scripts find a browser — live in
`C:\PROJECTS\revealjs-dsh\plugin\docs\adr\`, which states the split explicitly:

> Decisions about one particular deck — its palette, its chart conventions, its
> data caveats — belong *with that deck*, not here.

Format follows the plugin's records: status, date, what guards it, then Context /
Decision / Consequences / What breaks if you change this. Keep them short.

## Index

| # | Decision |
| --- | --- |
| [0001](0001-the-chart-config-must-be-json.md) | The chart config is JSON, so the axis unit went in the title — not a callback |
| [0002](0002-layout-repairs-after-a-green-overflow-check.md) | Seven layout repairs, made after a green overflow check |
| [0003](0003-self-contained-means-copying-the-audio.md) | Self-contained means the dialog clips are copied into the deck |
| [0004](0004-the-deck-was-rebuilt-to-one-idea-per-slide.md) | The deck was rebuilt to one idea per slide, in lesson order |
| [0005](0005-the-reading-trend-returns-with-its-limits-stated.md) | The reading trend returns, and the OECD line is dashed for a reason |
| [0006](0006-the-title-slide-sits-on-the-alarm-clock.md) | The title slide sits on the alarm clock, behind an 84% scrim |
| [0007](0007-chart-legend-and-projector-sized-axis-text.md) | Chart slides: question on top, axis text for a projector, and a legend built in HTML |
| [0008](0008-the-teachers-script-came-off-the-slides.md) | The teacher's script came off the slides |
| [0009](0009-a-provenance-slide-with-the-source-named-correctly.md) | A provenance slide before the first chart, with the source named correctly |
| [0010](0010-the-writing-slide-lost-its-prep-explainer.md) | The writing slide lost its PREP explainer |

## Deck facts these records assume

- **Stem:** `M3-051026-READING`, matching `PDF/M3-051026-READING.pdf` and
  `JSONS/M3-051026-READING.json` (plugin ADR 0018).
- **20 slides, 4 audio players, 2 Chart.js line charts, 3 countdown timers.**
- **Slide 2 is a provenance slide** — it names the source (the OECD, which runs
  PISA) before any chart appears, and carries the **official PISA and OECD asset
  the teacher supplied**, copied into the deck as `pisa.jpg`. See
  [0009](0009-a-provenance-slide-with-the-source-named-correctly.md), which also
  records the two factual corrections made to the text it was commissioned with.
- **Five classroom imperatives are offset** — a cue that tells the class to act
  (*"Talk to each other."*, the reading cue, the role-card cue, the writing cue, the
  closing cue) is set maroon and bold behind a maroon rule, hugging its text. It comes
  from the theme's `.imperative`, not from this deck, so a future deck inherits it.
  See the plugin's ADR 0025 and `references/design-principles.md`.
- **The deck is `index.html` + `styles.css` + `vendor/` + `audio/` + two images**
  (`alarm-clock.jpg`, the title background; `pisa.jpg`, the provenance mark). All
  of them must travel with the folder; nothing is fetched.
- **Source plan:** `JSONS/M3-051026-READING.json` — a 46-minute M3A reciprocal
  teaching reading lesson, shape I, CEFR B1–B2.
- **The lateness data** is the trend 44% (2018), 41% (2022), 44% (2025), Thailand
  only, from the OECD *PISA 2025 Results Volume I* country note for Thailand.
  `PISA-reading-data-2000-2025.md` in the lesson folder is the source of record.
  It states two hard rules. **One still holds: do not put the OECD lateness column
  on the slide.** **The other was reversed on 2026-10-06 by the teacher's
  instruction** — the reading-score trend is now charted against the OECD, on a
  slide whose whole purpose is the comparison. See [0005](0005-the-reading-trend-returns-with-its-limits-stated.md),
  which records the reversal and the data limits that came out of verifying it.
- **The countdown timer** is not a deck decision: it is first-party code in the
  plugin, at `vendor/timer/timer.js`, and its contract is `references/timers.md`
  there. Plugin ADR 0021 records why it never starts by itself.
- **The two charts are drawn by the reveal.js chart plugin**, whose config is
  parsed as JSON — see [0001](0001-the-chart-config-must-be-json.md). Neither
  chart uses a callback. **Each chart slide carries an HTML legend rather than
  Chart.js's own**, because a Thai flag and a dash pattern cannot be drawn by a
  config that is parsed as JSON, and **no source line is printed on either chart
  slide** — the provenance is in [0005](0005-the-reading-trend-returns-with-its-limits-stated.md)
  and the reasoning in [0007](0007-chart-legend-and-projector-sized-axis-text.md).
- **Text on these slides is sized for the room, held to CRAP, and student-facing.**
  Five sizes only — **100** (the timer readout), **44**, **36**, **24**, **18** —
  one per role, with no near-pairs; the title slide's 84% scrim is a reviewed,
  approved decision rather than a defect ([0006](0006-the-title-slide-sits-on-the-alarm-clock.md)).
  **The deck carries no teacher notes**: four dialog prompts transcribed from the
  plan were removed on 2026-10-06 — see
  [0008](0008-the-teachers-script-came-off-the-slides.md). The rules behind both
  live in the plugin: `references/type-scale.md`, `references/design-principles.md`,
  and plugin ADR 0022/0023/0024.
