# 0005 — The reading trend returns, and the OECD line is dashed for a reason

- **Status:** Accepted. **Reverses a rule stated in `PISA-reading-data-2000-2025.md`.**
- **Date:** 2026-10-06
- **Guarded by:** `check-charts.js` (chart 2 parses, 0 errors, 0 warnings). **Nothing guards the data** — the figures are hand-entered, and nothing re-checks them against OECD.

## Context

`PISA-reading-data-2000-2025.md` states the exclusion twice and gives its reason:

> The reading scores and the OECD comparison are no longer in the plan. They were
> removed on 3 October 2026 […] **Do not reintroduce it:** […] a national reading
> trend compared with the OECD moves the argument away from the students and hands
> them a contradiction instead of the article's case.

On 2026-10-06 the teacher asked for exactly that slide as part of this redesign,
titled "And what does this graph communicate?", placed immediately after the
lateness chart. The reason the exclusion is now wrong is that **the lesson's
premise changed in the same brief**: the new think slide asks the class "Do you
think there is a connection between being on time and how well you do
academically?", in PREP. The Thailand-versus-OECD comparison is now the lesson's
opening question rather than a contradiction dropped on students from the front.

The reversal is recorded here so it is a decision rather than an accident.

**It was then verified, because the source file's own figures are not all sound.**
Every figure was checked against a primary OECD source:

- **Thailand: all seven values confirmed** — 2006 417, 2009 421, 2012 441, 2015
  409, 2018 393, 2022 379, 2025 392 — from *PISA 2022 Results Volume I*, Table
  I.B1.5.5 and the PISA 2025 country note for Thailand.
- **OECD average: six of seven confirmed** (2009 493, 2012 496, 2015 493, 2018
  487, 2022 476, 2025 461). **2006 = 489 could not be confirmed from a primary
  source at all** — it appears only in Wikipedia's cross-cycle table, and a
  primary table gives a conflicting **494** for "OECD average-30", a different
  panel.
- **The seven OECD values are not one comparable series.** Each cycle's average is
  computed over the OECD members that took part *in that cycle*, and membership
  grew (30 members in 2006, 38 now). OECD's own fixed panels read **488** for 2018
  and **477 → 463** for 2022 → 2025, where the per-cycle headline figures read 487
  and 476 → 461. The source file's implied "different basis from 2022" is the
  wrong explanation: the rule never changed, the country set did.
- Reading was a **minor** domain in 2025 (science was major), so PISA 2025
  produced no reading subscales that cycle.

## Decision

Draw the slide, and draw it honestly:

1. **Thailand takes all seven cycles.** The series is primary-sourced end to end.
2. **The OECD line starts at 2009.** The 2006 point is *omitted* rather than
   guessed — a gap is visible, and it is true.
3. **The OECD line is dashed**, and the legend calls it the "OECD average".
4. **The footnote states the limit in the source's own terms**: each cycle's
   average covers the OECD members that took part in that cycle, so the country
   set varies and the comparison is approximate; and it says why the line starts
   in 2009.
5. **Reading scores are never plotted against the lateness percentage.** One is
   score points on a ~500 scale, the other is percentage points; the source file
   warns about this and the two charts are kept on separate slides and separate
   axes.

## Consequences

- The deck can answer "what does this graph communicate?" with the two real
  shapes: **Thailand peaked at 441 in 2012, fell 62 points to 379 by 2022, and
  recovered 13 to 392** — still 49 below its own peak — while the OECD line also
  falls over the same years.
- **A teaching point is available and is deliberately not on the slide:** 2025 is
  the lowest OECD-average reading score PISA has ever recorded, and the narrowing
  gap is mostly the OECD falling rather than Thailand catching up.
- The two 2022 → 2025 changes (headline −14, comparable panel −14) agree, so the
  *direction* is robust even though the levels depend on which basis is quoted.
- One cell of the chart is a gap instead of a number, which is the honest cost of
  not having a source for it.
- **The on-slide source line was removed on 2026-10-06**, at the teacher's
  request: at 11pt it was unreadable projected, and readability beats a citation
  nobody can read. **This record is therefore now the only place the figures'
  provenance is written down**, which is why the sources are spelled out in full
  above rather than summarised. The comparability caveat did *not* go with it —
  it moved into the legend, at a readable size — see
  [0007](0007-chart-legend-and-projector-sized-axis-text.md).

## What breaks if you change this

- **Plot 489 for 2006.** It is the one figure with no primary source, and a
  conflicting primary figure exists. Put it back only with a citation.
- **Drop the dashes or the footnote.** An unqualified continuous "OECD average"
  line across 2006–2025 claims a comparability the data does not have — the seven
  points come from different country sets.
- **Add the lateness percentage to this chart's axis.** Percentage points against
  score points; `PISA-reading-data-2000-2025.md` flags this in bold, and it is the
  single easiest way to make this slide meaningless.
- **Quote 463 as "the OECD average" alongside Thailand's 392.** 461 is the
  headline figure; 463 is the 35-country comparable panel. Mixing the two bases in
  one sentence is the error the source file warns about.
