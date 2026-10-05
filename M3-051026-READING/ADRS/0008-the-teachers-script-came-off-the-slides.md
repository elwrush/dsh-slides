# 0008 — The teacher's script came off the slides

- **Status:** Accepted
- **Date:** 2026-10-06
- **Guarded by:** nothing. These lines sat at 18pt in the label role with correct proximity, so `check-overflow.js`, `check-charts.js`, the type-floor measurement and the CRAP audit all passed the deck while it carried them.

## Context

The deck was audited by dumping the visible text of all 19 slides and reading it
line by line. Four lines were addressed to the teacher, not the class:

> Listen for: what exactly does Ava guess? — on the Predictor slide
> Listen for: which word stopped Marcus? — on the Clarifier slide
> Listen for: what did the text never answer? — on the Questioner slide
> Listen for: what word did the summary leave out? — on the Summariser slide

They were transcribed from the printed plan's Stage 3, which tells the teacher:
*"After each dialog, ask: 'Which job was that? What exactly did the student say?'"*
So they were the teacher's comprehension-check questions, and the class was being
shown them.

**This was the second time.** An earlier revision had the same four prompts on the
*transcript* slides in a blunter form — *"Play it once, then ask: what exactly did
Ava guess?"* — where *"play it once"* is an instruction about what the teacher
does. That version was removed while fixing proximity, and the prompts reappeared
on the instruction slides in the class's framing. Rephrasing a teacher note does
not make it student-facing.

## Decision

**All four are off the slides.** Nothing replaces them: the question is already in
the plan at the point the teacher needs it, and the plan is what the teacher reads
while running the lesson.

**What did not change is the class's own instructions.** *"Look at the starter
sentences on your role card"*, *"write at least 70 words"*, *"read the last three
chunks in your group — 10 minutes"* are addressed to the class and stay. The test
is the **addressee**, not the imperative mood.

## Consequences

- A scan of the deck's visible text for teacher-directed language — *ask*,
  *monitor*, *circulate*, *elicit*, *play it once*, *make sure*, *board* — returns
  **nothing**.
- The four role slides are tidier: they had been carrying a kicker, a title, a job
  description *and* a prompt.
- The plan is unchanged, so the teacher's script is intact where it is used. Note
  the two documents already had a mirror rule: the printed plan carries no
  *authoring* notes, and now the deck carries no *teaching* notes.
- `check-overflow.js` still exits 0 on all 19 slides; nothing else moved.

## What breaks if you change this

- **Copy a prompt, or a rephrasing of one, back onto a slide.** The first version
  was *"Play it once, then ask…"* and the second was *"Listen for: …"* — same note,
  different grammar. Rewording is not the fix.
- **Strip the class's second-person instructions** in the name of this rule. They
  are addressed to the class and belong on the slide.
- **Rely on the gates.** Every automated check passed this deck while it carried
  the teacher's script to the class. Reading the text is the check.
