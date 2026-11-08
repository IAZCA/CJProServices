# CJ Pro Services: test website

Test site for CJ Pro Services LLC (heating, cooling, electrical and home repair, Laurel, MD).

Live (GitHub Pages): https://iazca.github.io/CJProServices/

- `index.html`: **the chosen design** ("Night Shift"), which is the home page
- `designs.html`: page comparing the three design options
- `design-2-blueprint.html`, `design-3-truck-wrap.html`: the other two options, kept for reference
- `assets/`: logo files (cut from the invoice logo), shared `site.js` (movement) and `base.css`
- `NOTES.md`: research on example HVAC sites, facts used, what still needs confirming

Plain HTML, no build step. Pushing to `main` updates the live site after a minute or two.
To preview locally, run `python -m http.server 8418` in this folder and open `http://localhost:8418/?motion=on`.
`?motion=on` forces the animations on PCs that have them turned off.

The photo areas are blank placeholders and the quote form isn't connected yet. Pages carry `noindex`, so search engines
won't list the test site.
