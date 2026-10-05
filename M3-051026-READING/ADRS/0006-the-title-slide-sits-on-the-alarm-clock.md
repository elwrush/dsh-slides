# 0006 — The title slide sits on the alarm clock, behind an 84% scrim

- **Status:** Accepted
- **Date:** 2026-10-06
- **Guarded by:** a browser probe (the image is fetched from the deck's own folder, the computed `background-image` carries it, nothing 404s, and the deck makes no network request). Nothing ships that re-checks it.

## Context

The title slide was to be kept as it was and laid over the alarm clock image.
That image is a problem for exactly that use: it is **an alarm clock centred on a
pure white background**, and the title slide is **centred text**. The two occupy
the same pixels. Dark text over the white margins would be fine; dark text across
the clock face — hands, numerals, a rusty case — would not.

The image is `M3-051026-READING-clocks.jpg` from the lesson's `SLIDES/` folder
(Pixabay asset 2175382, by PIRO4D, whose sidecar records
`attribution_required: true`).

## Decision

1. **The image goes behind the text at 84% white**, as one inline
   `background-image` on the section: a `linear-gradient` scrim over `url(...)`,
   `background-size: cover`. Contrast is then effectively the page's own, and the
   clock reads as a backdrop.
2. **It is applied inline on the section, not in `styles.css`.** It is one deck's
   photograph, so it does not belong in the component stylesheet every deck
   copies — and this keeps `styles.css` a byte-identical copy of the plugin's
   `base-styles.css`.
3. **The image is copied into the deck folder** as `alarm-clock.jpg`, so the deck
   stays self-contained, and its provenance sidecar travels beside it.
4. **The attribution is a footnote on the slide.**
5. **The scrim is one number.** The two `0.84` values are the whole control: lower
   to show more clock, raise if a projector washes the text out.

## Consequences

- **Approved as it stands, by the teacher, 2026-10-06.** They were asked
  directly why the image looks washed out, were given the measurement above
  (image mean luma 241/255; 249/255 after the scrim; 39/255 of tonal range left)
  and the alternatives — a lighter scrim, an offset clock, a gradient scrim, a
  different photograph — and chose to **leave it as it is**: *"It's good, leave
  as is. I like it. The title is readable."*
  **The wash is the decision, not a defect.** A future session looking at this
  slide and finding the photograph pale should read this record before
  "improving" it; the flat 84% scrim is deliberate, and it is the reason the
  title is readable over a subject that sits in the same pixels.
- The title slide's own design is untouched — same centred layout, same chips,
  same white page tone — which is what "keep it" asked for.
- Verified in headless Chromium: the alarm clock is requested from the deck folder
  and not 404ed, the computed `background-image` on `#title` carries it, and the
  deck still makes **no network request at all**.
- `check-overflow.js` cannot see any of this: a background image has no box, so a
  missing or unreadable one passes every gate. The probe is the only thing that
  looked.

## What breaks if you change this

- **Delete the scrim.** The title then competes with the clock face, and the one
  slide the teacher specifically kept becomes the least legible in the deck.
- **Reference the image from `SLIDES/` instead of copying it into the deck.** The
  deck breaks the moment it is moved or shared, which is the rule ADR 0003 already
  sets for audio.
- **Move the background into `styles.css`.** Every future deck inherits one
  lesson's photograph, and the stylesheet stops matching the plugin's.
- **Drop the footnote.** The image's sidecar records that attribution is required.
