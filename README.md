# Hatted Duck Studios website

Source for the public Hatted Duck Studios site at:

https://frank.hattedduckstudios.workers.dev

## Publishing model

The `main` branch is the production source. Cloudflare should deploy this branch to the existing Worker named `frank`.

Frank's Office is the private editing and publishing interface. Routine content changes are stored in `content.js`; the public layout and styling remain in `index.html` and `style.css`.

## Files

- `content.js` — studio copy, social links, values, and game listings
- `index.html` — public page structure
- `style.css` — visual design and responsive layout
- `script.js` — rendering behavior
- `assets/` — exact original Hatted Duck artwork
- `editor.html` — emergency offline content editor

Do not replace the supplied logo or Frank headshot with generated or reinterpreted artwork.
