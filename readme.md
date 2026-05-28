# Eesh Saxena — Portfolio

Source for [eeshsaxena.com](https://eeshsaxena.com), a dual-mode personal portfolio:

- **2D site** (`/`) — a fast Remix + Cloudflare Pages portfolio.
- **3D experience** (`/3d`) — an interactive Three.js scene.
- **EeshOS** (`/os`) — a small in-browser OS shown on the 3D monitor.

## Develop

```bash
npm install          # install root (3D) dependencies
npm run dev          # 3D scene (webpack dev server)
npm run dev:simple   # 2D Remix site
npm run dev:all      # run both together
```

## Build & deploy

```bash
npm run build:unified   # build the 3D scene and assemble it into the 2D project
npm run deploy          # build everything and deploy to Cloudflare Pages
```

The whole site ships as a single Cloudflare Pages project on eeshsaxena.com.

## Credits

The 3D scene is built on an open-source Three.js portfolio base (MIT licensed —
see `LICENSE.md`), customized and extended throughout.
