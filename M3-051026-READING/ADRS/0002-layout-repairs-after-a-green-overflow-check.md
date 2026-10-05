# 0002 — Seven layout repairs, made after a green overflow check

- **Status:** Accepted
- **Date:** 2026-10-05
- **Guarded by:** `check-overflow.js` (exit 0, 18 slides) proves none of these repairs introduced clipping. Nothing guards that they are still *present* — they are structural CSS and inline styles, and a later edit can silently undo one.

## Context

`check-overflow.js` reported **`No overflow detected on any slides` for all 18 slides**
while the deck had seven real layout defects. That is not the checker failing: it
measures excess box size, and none of these is overflow. They were found by looking
at the rendered slides. Plugin ADR 0019 records why a passing overflow check is not
a layout review; this record is the evidence, and the repairs.

The defects, in the order they matter:

1. **The chart's y-axis was unlabelled** — its own record, see [0001](0001-the-chart-config-must-be-json.md).
2. **Two pairs of cards had unequal heights** (the two question cards, and the two halves of the Clarifier slide). A `1fr 1fr` grid stretches its items only if they are asked to; with default alignment each card sized to its own text, so the shorter one sat visibly short beside its partner.
3. **The task slide's "Punishment or praise?" line was centred under a two-column grid**, so it read as a caption for the grid rather than as the conclusion of the left column, and the eye had to travel back and forth.
4. **Three slides ended in dead whitespace** — content sat high in the frame with a third of the slide empty below it.
5. **Slides using a 1.15 line-height on a 54pt figure had no vertical breathing room** in the stat cards.
6. **A new slide had been spliced into the middle of an existing one.** A bulk edit that replaced only a section's opening `<h2>` left that section's body orphaned *after* the next `</section>`, so the "Before you hand it in" slide landed inside "Your turn: Chunks 2–4". Both slides still rendered, and the overflow check still passed.
7. **Panels were separated from the page by a tint only.** A tone-94 fill measures **1.11:1** against the background, so on a projector the panels would have vanished, whatever they look like on a monitor.

## Decision

1. **Cards that pair are explicitly stretched.** The grid gets `align-items: stretch` and each card is made a centred flex column, so a pair always reads as a pair.
2. **The task slide's conclusion moved into the left column**, below the question and the word count, instead of being centred across the slide.
3. **Content blocks are centred in the space they occupy** (`justify-content: center` on `.content`) rather than aligned to the top, and `.content` now reserves a bottom padding so a centred block clears the absolutely positioned footnote.
4. **Readable-size text on the light slides is set larger** — the dark dividers keep their larger scale. This is deliberately not uniform: the dividers are a breath between sections and carry almost no text.
5. **The sub-heading labels were raised from 12pt to 13pt**, because 12pt uppercase with wide letter-spacing is the smallest thing on the deck and the least legible at the back of a room.
6. **The section order is verified after bulk edits**, by listing `<section id=` and reading the sequence. The splice was invisible to every check; only the structure listing and a careful look caught it.
7. **Every panel carries `--card-border`.** The tint is the surface, the border is what makes it visible when projected. `references/colour.md` measures this; a tone-80 border is 1.62:1 against the background, where the tint is 1.11:1.

**The six reusable components these repairs introduced were then moved into the
plugin's `base-styles.css`** — see plugin `NOTICE`. `.panel`, `.panel-data`, `.beat`,
`.stat`, `.role-card` and `.prep-move` are named for a visual role, not for this
lesson, so writing them into this deck's `styles.css` made them unreachable by the
next deck. The `styles.css` here is now a copy of the plugin's file, with no local
additions.

## Consequences

- **The deck reads as deliberately laid out rather than assembled**, which matters because it is projected beside a printed plan and four audio clips.
- **`align-items: stretch` on a `1fr 1fr` grid changes nothing about the markup**, so a future content edit that makes one card much taller will raise its partner rather than leaving a gap. That is the desired behaviour for a pair, and it is worth remembering when a pair is *not* wanted.
- **`.content` now has a bottom padding of 40px.** A slide that sets its own padding overrides it; three slides do, all with `padding-bottom: 20px` where the block is deliberately centred.
- **The repairs are not covered by a test.** They are CSS and inline styles. `check-overflow.js` will catch it if a change makes something *larger* than the slide, and will say nothing if a change undoes a visual repair.
- **No `.content` regression was observed on the other 15 slides**, confirmed by the overflow check returning exit 0 for all 18 after the change.

## What breaks if you change this

- **Remove `align-items: stretch` from a paired grid.** The cards go back to sizing to their own text and the shorter one looks like a mistake.
- **Centre a sentence under a two-column grid.** It reads as a caption for both columns, which is rarely what is meant, and it is what defect 3 was.
- **Let a slide align its content to the top by default.** The dead-whitespace defect returns on every slide with less than a full page of content.
- **Drop `--card-border` from a panel.** It looks fine on a monitor at arm's length, which is exactly why the mistake survives review on a screen and appears in a classroom.
- **Do a bulk edit that targets only a heading.** Replacing an opening `<h2>` can orphan the body after the next `</section>`, interleaving two slides while both still render. Re-list the section order afterwards.
