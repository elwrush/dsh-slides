# 0009 — A provenance slide before the first chart, with the source named correctly

- **Status:** Accepted
- **Date:** 2026-10-06
- **Guarded by:** `check-overflow.js` (exit 0, 20 slides). The deck's own next-slide legend and [0005](0005-the-reading-trend-returns-with-its-limits-stated.md) guard the *claim*: they name the OECD, so a slide saying "United Nations" would contradict the slide that follows it.

## Context

The teacher asked for one slide before *"What is this graph communicating?"*,
carrying a PISA logo and this text:

> The data we are going to look at now comes from the United Nations. Every four
> years students in classes all around the world are check for how well they do in
> Reading, Science and Math. Let's look at some of the data.

**Two statements in it are wrong, and one is a grammar slip.**

1. **PISA is run by the OECD, not the United Nations.** The OECD — the Organisation
   for Economic Co-operation and Development — is an intergovernmental
   organisation of 38 members, separate from the UN. This is not a technicality
   here: the **very next slide's legend reads "OECD average"**, and
   [0005](0005-the-reading-trend-returns-with-its-limits-stated.md) cites the OECD
   *PISA 2025 Results Volume I* country note. A deck that said "United Nations" on
   one slide and "OECD" on the next would be teaching the class the wrong body and
   contradicting itself in the same breath.
2. **PISA runs every three years, not four.** The lesson's own source of record,
   `PISA-reading-data-2000-2025.md`, lists cycles 2006, 2009, 2012, 2015, 2018,
   2022 and 2025 — and the chart this slide introduces plots seven of them at
   three-year intervals. "Every four years" would misdescribe the axis the class is
   about to read.
3. *"are check"* → **"are checked"**.

**On the logo.** The PISA mark is an OECD trademark. The copies circulating on
logo-aggregator sites carry their own terms stating the marks are copyrighted and
that *"you are not permitted to copy, modify, or refine the logo design."* An image
model cannot be asked to draw it either — a generated approximation of a
trademark is a fake, and worse than no mark at all. **So the first version of this
slide carried the programme's name set in the deck's own type instead, and the
teacher then supplied their own copy of the official asset** — which is the one
correct source, and what the slide uses now.

## Decision

1. **The source is named correctly: the OECD.** The text keeps the teacher's voice
   and structure — *"The data we are going to look at now comes from the OECD…"* —
   and only the two facts and the verb change.
2. **"Every three years"**, which is what the data file and the chart both show.
3. **The mark is the official asset, supplied by the teacher.** They provided
   `PROJECTS/M3 - TARDINESS/SLIDES/PISA.jpg` — the PISA wordmark and the OECD logo
   — and it is copied into the deck folder as **`pisa.jpg`** so the deck stays
   self-contained. **It is not from a logo-aggregator site and not generated**; the
   teacher's own file is the only correct source, and sourcing a trademark is the
   client's decision rather than the deck-builder's.
   It sits on a **white card**, because the asset is an opaque JPEG on a white
   background: placed straight on the near-white page it leaves a visible box
   edge. *"OECD Programme for International Student Assessment"* stays beneath it,
   because the mark shows the acronym and the line teaches what it means.
4. **It is a statement divider**, like the bridge slide: kicker, mark, paragraph.
   Its sizes are **44 / 24 / 18pt** — three roles the deck already has, so the slide
   adds no sixth size.
5. **No teacher notes.** The text is addressed to the class throughout ("we",
   "Let's"), so it already satisfies the audience rule.

## Consequences

- The deck is **20 slides**; the new one sits second, before any chart. A class
  now meets the source before it meets the data.
- The claim on the slide now agrees with the legend on slide 4, with
  [0005](0005-the-reading-trend-returns-with-its-limits-stated.md), and with
  `PISA-reading-data-2000-2025.md`.
- No new size entered the type scale: measured, the deck is still
  **100 / 56 / 44 / 36 / 24 / 18** with no near-pairs, and the type floor holds at
  18pt minimum. `check-overflow.js` exits 0 on all 20.
- **The slide-index comments in the file were renumbered** to match, and the two
  that sit before the insertion point were corrected by hand after a blanket bump
  got them wrong. Verified: every numbered comment now names the slide it precedes.

## What breaks if you change this

- **Restore "United Nations".** Slide 4's legend says "OECD average" and 0005 cites
  an OECD report — the deck contradicts itself on consecutive slides.
- **Restore "every four years".** It contradicts the seven three-yearly cycles the
  next chart is drawn from, and the data file of record.
- **Lift the PISA logo from a logo-aggregator site.** Their own terms forbid
  copying or modifying the mark, and it is an OECD trademark either way. The
  teacher's own file is the source; ask for it.
- **Generate a logo-shaped image with a model.** An approximation of a trademark is
  a fake, and a wrong logo on a slide about a data source is worse than none.
- **Put the asset straight on the page instead of on a white card.** It is an
  opaque JPEG on white, so the page's warm near-white shows an edge around it and
  it reads as a pasted screenshot.
- **Drop the "OECD Programme for International Student Assessment" line.** The mark
  is an acronym; the line is what tells a class what the acronym means.
