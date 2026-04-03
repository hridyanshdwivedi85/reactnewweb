# reactnewweb

## Setup (node_modules)

`node_modules` is **not** committed to Git (standard practice). Install dependencies locally with:

```bash
npm install
```

This will create the `node_modules/` folder on your machine.

## Run locally

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment note (Netlify + GitHub Pages)

- `vite.config.js` now auto-detects platform base paths:
  - **Netlify:** `/`
  - **GitHub Pages (Actions):** `/reactnewweb/`

If you deploy from a custom CI, set the correct base explicitly via env and/or adjust `vite.config.js`.
