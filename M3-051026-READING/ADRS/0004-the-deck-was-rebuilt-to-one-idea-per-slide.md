# 0004 — The deck was rebuilt to one idea per slide, in lesson order

- **Status:** Accepted
- **Date:** 2026-10-06
- **Guarded by:** `check-overflow.js` (exit 0, 19 slides) and `check-charts.js` (2 charts, 0 errors, 0 warnings). **Nothing guards the prose density or the slide order** — both are editorial, and both were the point of the change.

## Context

The teacher's judgement was that the deck had become too verbose and should be
redesigned. Measured, it was **18 slides carrying 943 words, an average of 52 a
slide**, and the length was mostly repetition rather than content:

1. **The four roles were described three times.** The role cards slide (101 words,
   the longest in the deck), then one slide per role, then a "what each role buys
   you" table repeating all four again.
2. **The lesson question was printed on three slides** — `divider-2`, the task
   slide and the close slide — and paraphrased a fourth time on the title.
3. **The lateness chart's own three values were reprinted as stat cards directly
   beneath the chart**, so the reader was told 44/41/44 twice in one glance.
4. **PREP appeared twice**: the frame slide, then again as a checklist before
   handing in.
5. **The order did not follow the lesson.** "Your turn: Chunks 2–4" — Stage 5 —
   sat *after* the writing task, Stage 7.
6. **`divider-3` split the four role slides**, so the set read role 1, divider,
   roles 2 to 4.

The pattern behind all six is the same: the deck restated in prose what the slide
beside it already showed, and moved a slide's explanation onto the next slide's
topic.

## Decision

Rebuild the deck around six rules, which are the thing to keep:

1. **One idea per slide.** If a slide needs a second block to explain its first,
   that is the next slide.
2. **Each of the four roles is exactly two slides**: one that says what the job is,
   and one carrying the model dialog's full transcript and its audio. The role
   cards and the summary table are gone — the instruction slide and the dialog
   together say what the table said.
3. **A question slide carries the question and nothing else.** The two chart
   slides ask what the graph communicates; they do not answer it.
4. **The deck runs in the lesson's order**: charts, think, read together, the four
   roles, read the chunks, change roles, discuss, write, close.
5. **A slide the class works from is a content slide; a slide that only says
   something is centred.** The instruction slides are centred because nothing is
   read off them.
6. **A timer the teacher controls replaces every "you have N minutes" that would
   otherwise be policed by eye** — plugin ADR 0021.

## Consequences

- **19 slides, and the headline word count barely moved: 949 against 943.** That
  is not a failure of the redesign, it is where the words went. The four dialog
  transcripts are **new** and carry 475 of those words between them; the other
  **15 slides carry 474 words, 31.6 a slide, against 52.4 across the old 18.** The
  verbosity went out of the slides the class reads from and into the four
  transcripts, which exist to be read *while listening*.
- Every repeated block is gone: the roles are described once per role, the lesson
  question is asked once, the chart's numbers appear only in the chart.
- The deck now agrees with `JSONS/M3-051026-READING.json` about the running order,
  so a teacher following the printed plan and a teacher following the deck do the
  same lesson.
- Two charts, four audio players, three timers, and no network request at all.

## What breaks if you change this

- **Add an explanatory sentence to a question slide.** That is how the deck
  reached 101 words on one slide: each addition is defensible alone, and together
  they turn a prompt into a paragraph nobody reads at arm's length.
- **Restore the "what each role buys you" table.** The roles are then described
  twice, which is the defect this record exists to prevent.
- **Move `chunks-read`/`change-roles` after `write-prep`.** The deck contradicts
  the printed plan's stage order, and the two artefacts stop agreeing.
- **Put the chart's figures in cards beside the chart.** It reads as emphasis and
  functions as duplication.
