# Hatted Duck Studios website

Production source for [frank.hattedduckstudios.workers.dev](https://frank.hattedduckstudios.workers.dev).

## Deployment

The `main` branch is connected to the existing Cloudflare Worker named `frank`. Cloudflare Workers Builds deploys pushes from `main` with:

```text
npx wrangler deploy
```

The Worker name and `name` in `wrangler.jsonc` must both remain `frank`.

## Structure

- `public/content.js` — studio copy, social links, values, and game listings
- `public/index.html` — public page structure
- `public/style.css` — visual design and responsive layout
- `public/script.js` — rendering behavior
- `public/assets/` — exact original Hatted Duck artwork
- `public/editor.html` — emergency offline content editor
- `wrangler.jsonc` — Cloudflare Worker and static asset configuration

Frank's Office is the private editing and publishing interface. It should commit approved changes to `main`; Cloudflare then builds and deploys them.

Do not replace the supplied logo or Frank headshot with generated or reinterpreted artwork.
