# 0003 — Self-contained means the dialog clips are copied into the deck

- **Status:** Accepted
- **Date:** 2026-10-05
- **Guarded by:** `offline.cjs` fails when a clip is missing, mistyped or remote, and asserts each player reports a duration and a seekable range. Verified for this deck: the four deck copies are SHA-256 identical to the lesson library's originals.

  **When run against this deck, `offline.cjs` exits 1 with two findings that are `offline.cjs`'s own artifacts, not deck defects** — measured 2026-10-05, and both reproduce on a minimal probe deck built from the stock scaffold, so neither is caused by this deck. Read the media block rather than the exit code:

  | Report | Why it is not a defect |
  | --- | --- |
  | `no request may fail, saw: …dialog1-predictor.mp3 (net::ERR_ABORTED)` for all four clips | Chromium releases a media fetch it no longer needs; with `preload="metadata"` the part-fetch is aborted after the header. The check's own media assertions pass for every player: `readyState=4`, `controls=true`, a real `duration` (37.5 s, 26.5 s, 22.4 s, 28.6 s) and a matching **seekable** range. A clip that genuinely failed to load reports `readyState=0`, `duration 0` and `MediaError`. This is the same class of false positive the check already filters for a same-document fragment jump. |
  | `the icon must render a glyph from the icon font, not a fallback character` | `fonts: "Font Awesome 6 Free" loaded = true` and the measured width is identical with and without the face (1659 px vs 1659 px) — the width proxy does not distinguish the glyph on this machine, so the assertion cannot pass here even though all 25 icons paint from the vendored font. |

## Context

Stage 3 of the plan plays four taped role-model dialogs, one per reciprocal-teaching
role, and Stage 4 rehearses the register from them. They are the mechanism by which
the four strategies are made visible, so if they do not play, the lesson's central
move does not happen.

The clips already existed in the lesson's own library, named to the plan's convention:

```
AUDIO/M3-051026-READING-dialog1-predictor.mp3
AUDIO/M3-051026-READING-dialog2-clarifier.mp3
AUDIO/M3-051026-READING-dialog3-questioner.mp3
AUDIO/M3-051026-READING-dialog4-summariser.mp3
```

Two facts about the tooling forced the decision:

- **The scaffold copies `vendor/` and `styles.css` and nothing else.** It has no notion of media, so `audio/` is the one directory left to the author.
- **A relative path out of the deck folder would appear to work here and fail later.** `../AUDIO/clip.mp3` resolves on this machine because the lesson folder happens to sit where it does. Copy the deck somewhere else — a USB stick, another teacher's laptop, an archived folder — and every clip is gone. The deck is supposed to render with no network and no companions.

`AUDIO/` is also named for the plan, not for the deck, and the two artefacts serve
different purposes: the library is where a clip is produced and catalogued, the deck's
copy is what the deck plays.

## Decision

1. **All four clips are copied into the deck's own `audio/`**, and the deck references them relatively (`src="audio/<name>.mp3"`). Verified: all four are byte-identical to the library originals.
2. **They keep their lesson-library names**, including the `M3-051026-READING-` prefix and the role suffix. The name says which plan and which role, which matters when four players look identical on screen.
3. **One clip per `<audio controls>` element, on its own slide**, each in a bordered panel with a `<p>` label naming the dialog and the student who leads it: *"Dialog 1 — Ava predicts"*. The element carries no text of its own, so an unlabelled player is a control with no identity.
4. **The browser's own controls are used** — no vendored media plugin and no custom scrubber (plugin ADR 0014).
5. **No autoplay.** The teacher starts each clip; browsers block autoplay without a user gesture anyway, and Stage 3 pauses deliberately after each dialog to ask "which job was that?".
6. **Each player sits beside a committed hand-out.** A teacher can replay the tape or read the printed transcript, so a dead laptop does not cancel Stage 3.

The dialogue is not the deck's only form of the same content: each role's slide also
quotes one line from its transcript verbatim, so the move is readable even with the
sound off.

## Consequences

- **The deck survives being moved.** It is now genuinely self-contained: `index.html`, `styles.css`, `vendor/` and `audio/`.
- **The clips exist in two places**, and they can drift. The library copy is the source of record; the deck copy is a convenience. Re-recording a dialog means re-copying it, and nothing checks that automatically.
- **The deck is ~3.6 MB** rather than a few hundred kilobytes, because it carries four MP3s (about 1.8 MB) plus a full vendored `vendor/` (about 870 KB) and a reference screenshot set.
- **`PROJECTS/` is git-ignored**, so neither copy is backed up. The deck, its clips and the plan JSON exist only on the disk they were written to — the same exposure the lesson plan already had.
- **Reading the dialogue aloud remains possible**, which is the fallback the appendix transcripts were printed for.

## What breaks if you change this

- **Reference `../../AUDIO/clip.mp3` to avoid duplicating a file.** It works right up until the deck is copied anywhere else, which is exactly when it is being relied on.
- **Point a player at a remote URL.** It breaks the offline guarantee and fails in the one room where the network is down.
- **Leave a player unlabelled.** Four identical controls with no text, on four separate slides, and no way to tell which role is playing.
- **Delete the deck's `audio/` and keep the library copy.** The lesson folder still has the sound; the deck does not, and the deck is what gets presented.
- **Add `data-autoplay`.** The clip starts on slide entry with no gesture, which the browser blocks — so it silently does not play — and it removes the pause Stage 3 depends on.
