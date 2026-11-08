# CJ Pro Services: test website

Test site for CJ Pro Services LLC (heating, cooling, electrical and home repair, Laurel, MD).

- `design-1-night-shift.html`: **the chosen design**
- `design-2-blueprint.html`, `design-3-truck-wrap.html`: the other two options, kept for reference
- `index.html`: page to pick between the three
- `assets/`: logo files (cut from the invoice logo), shared `site.js` (movement) and `base.css`
- `NOTES.md`: research on example HVAC sites, facts used, what still needs confirming

Plain HTML, no build step. To preview, run `python -m http.server 8418` in this folder and open
`http://localhost:8418/design-1-night-shift.html?motion=on`. `?motion=on` forces the animations on PCs that have them turned off.

The photo areas are blank placeholders and the quote form isn't connected yet.