# Vendored browser assets

These files are copied beside every deck the scaffold generates, so a deck
renders with **no network access**. Nothing here is fetched at runtime.

Replaced by `scripts/create-presentation.js` on every scaffold run, so updating
this directory is the way to move deck assets forward.

## Contents and versions

| Path | Package | Version | License |
| --- | --- | --- | --- |
| `reveal/reset.css`, `reveal/reveal.css`, `reveal/reveal.js` | [reveal.js](https://revealjs.com/) | 6.0.2 | MIT (`reveal/LICENSE`) |
| `reveal-plugins/chart/plugin.js` | [reveal.js-plugins](https://github.com/rajgoel/reveal.js-plugins) | 4.6.0 | MIT (`reveal-plugins/LICENSE`) |
| `chartjs/chart.umd.js` | [Chart.js](https://www.chartjs.org/) | 4.5.1 | MIT (`chartjs/LICENSE.md`) |
| `fontawesome/css/all.min.css`, `fontawesome/webfonts/*.woff2` | [Font Awesome Free](https://fontawesome.com/) | 6.5.1 | Icons CC BY 4.0, fonts SIL OFL 1.1, code MIT (`fontawesome/LICENSE.txt`) |
| `fonts/source-sans-3-latin-*.woff2` | [Source Sans 3](https://github.com/adobe-fonts/source-sans) via [Fontsource](https://fontsource.org/) | 5.3.0 | SIL OFL 1.1 (`fonts/LICENSE-Source-Sans-3.md`) |
| `fonts/source-serif-4-latin-600-normal.woff2` | [Source Serif 4](https://github.com/adobe-fonts/source-serif) via [Fontsource](https://fontsource.org/) | 5.3.0 | SIL OFL 1.1 (`fonts/LICENSE-Source-Serif-4.md`) |

All three JavaScript files are classic global scripts: none uses `import`,
`export` or `require`, so they load over `file://` without a server or a bundler.

## The text faces

Four `.woff2` files, latin subset only, **68,704 bytes** together. They are the
typefaces `base-styles.css` declares with `@font-face`, and they are why a deck no
longer renders in Arial by accident — see ADR 0015.

| File | Family | Style | Weight | Bytes |
| --- | --- | --- | --- | --- |
| `source-sans-3-latin-400-normal.woff2` | Source Sans 3 | normal | 400 | 15,696 |
| `source-sans-3-latin-400-italic.woff2` | Source Sans 3 | italic | 400 | 15,808 |
| `source-sans-3-latin-600-normal.woff2` | Source Sans 3 | normal | 600 | 15,668 |
| `source-serif-4-latin-600-normal.woff2` | Source Serif 4 | normal | 600 | 21,532 |

Three things about them are deliberate and easy to undo by accident:

- **Only the 600 cut of Source Serif 4 ships**, because every heading rule in
  `base-styles.css` is `font-weight: 600`. A heading set to 400 or 700 has no
  file behind it and the browser synthesises a fake, which shows at 36pt.
- **Latin subset only, and the edge is sharp: there is no `→`.** Fontsource
  publishes `latin` and `latin-ext` for Source Sans 3, and **neither declares
  `U+2192`** — while `U+2191` (↑), `U+2193` (↓) and `U+2212` (−) *are* declared.
  A rightwards arrow therefore falls back to a system font, the deck stops being
  self-contained for that glyph, and a PDF export embeds the fallback face.
  Measured 2026-10-04: a deck using `&rarr;` produced `CAAAAA+SegoeUI` inside the
  exported PDF. Use the Font Awesome arrow instead, or add the subset file that
  contains the character. `tests/offline.cjs` now checks every text element
  against the declared faces and fails on an uncovered glyph.
- **The licences travel beside the fonts**, which SIL OFL 1.1 requires. The Adobe
  licence reserves the font name "Source", so an edited build must be renamed —
  these files cannot be modified and redistributed under the same name.

The subset instance reports its own internal family name, so Chromium and the
exported PDF both call the 400 weight `SourceSans3ExtraLight-Regular`. That is a
name-table artifact of instancing a variable font, not a wrong file: the 400 and
600 cuts have different advance widths, which is what `tests/offline.cjs`
compares rather than the name.

## Changes made to the vendored copies

**Font Awesome.** Only the four `woff2` font files are shipped. The original
`all.min.css` declared a `truetype` fallback for each `@font-face`, which would
have requested files that are not present; those eight fallback clauses were
removed, so no request 404s. Every `url(../webfonts/*.woff2)` reference resolves
inside this directory. No other edit was made.

**Everything else** is the published file, byte for byte. `reveal.css` embeds its
two background images as `data:` URIs and references no external file.

## Versions are pinned deliberately

Upstream's scaffold loaded reveal.js from a versioned CDN URL but pulled
`reveal.js-plugins@latest` and an unversioned `chart.js`. Those two could change
under a deck without warning. Every asset here is pinned to an exact version.

reveal.js was held at 5.1.0 — the version upstream targeted — until 6.0.2 was
verified against a real deck. It now ships **6.0.2**. That upgrade was gated on two
risks, both of which were tested rather than assumed:

1. **`reveal.js-plugins` 4.6.0 compatibility.** No release newer than 4.6.0 exists,
   so the chart plugin had to keep working as-is. It does: 4 of 4 charts painted
   under 6.0.2.
2. **`base-styles.css` matching the cascade.** The theme overrides `.reveal` and
   `.reveal-viewport` selectors written against 5.x. Under 6.0.2 a 17-slide deck
   with charts, tables, stat cards and dark dividers rendered **byte-identically**
   to the 5.1.0 baseline — all 17 screenshots matched by SHA-256.

Fragments, speaker notes, background colour and gradient, auto-animate (including
`data-id` matching), slide visibility and per-slide transitions were also compared
across both versions: the only difference in the whole feature report was the
version string. See ADR 0013.

## Refreshing an asset

```powershell
$base = 'https://cdn.jsdelivr.net/npm'
Invoke-WebRequest "$base/reveal.js@6.0.2/dist/reveal.js" -OutFile .\reveal\reveal.js
```

The text faces come from Fontsource, which republishes the Adobe sources as
subset `woff2`. Pin the version in the URL, then re-check the four sizes above —
a change in size means a different build, and the `@font-face` weights in
`base-styles.css` were written against this one.

```powershell
$base = 'https://cdn.jsdelivr.net/npm'
$v = '5.3.0'
Invoke-WebRequest "$base/@fontsource/source-sans-3@$v/files/source-sans-3-latin-400-normal.woff2"  -OutFile .\fonts\source-sans-3-latin-400-normal.woff2
Invoke-WebRequest "$base/@fontsource/source-sans-3@$v/files/source-sans-3-latin-400-italic.woff2"  -OutFile .\fonts\source-sans-3-latin-400-italic.woff2
Invoke-WebRequest "$base/@fontsource/source-sans-3@$v/files/source-sans-3-latin-600-normal.woff2"  -OutFile .\fonts\source-sans-3-latin-600-normal.woff2
Invoke-WebRequest "$base/@fontsource/source-serif-4@$v/files/source-serif-4-latin-600-normal.woff2" -OutFile .\fonts\source-serif-4-latin-600-normal.woff2
```

Refresh the two licence files from the Adobe repositories at the same time, so
the OFL text matches the build that is being redistributed.

Then re-run the scaffold in each deck, or delete the deck's `vendor/` directory
and scaffold again. **`node tests/register.mjs` fails if a `@font-face` in
`base-styles.css` points at a file that is not here**, so a half-finished refresh
cannot reach a deck.

## Adding a family the deck does not need

`fa-brands-400.woff2` (117 KB), `fa-regular-400.woff2` (25 KB) and
`fa-v4compatibility.woff2` (4.8 KB) are shipped but **no deck produced so far has
ever used them** — every icon in every deck was `fa-solid`. A browser only
fetches a webfont when a rule using its family applies, so they cost disk rather
than load time. Dropping them would save 147 KB and would need a check that no
deck references `fa-brands` or `fa-regular`; that is a change nobody has needed
yet.
