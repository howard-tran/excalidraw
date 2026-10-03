# Plan: `spikes/mutateAPI` — minimal Excalidraw canvas (plain Vite)

## Goal

A bare-bones Vite app under `spikes/mutateAPI` that mounts a single working `<Excalidraw />` canvas. No app chrome, no types, no `dist/` package builds, no new installs — reuse the root `node_modules` as-is.

## Constraints

- Canvas only: mount `<Excalidraw />` in a full-height container, nothing else.
- Plain Vite: `vite` + `@vitejs/plugin-react` only (no PWA/ejs/sitemap/svgr/checker plugins).
- No type emission: no `tsc`, no `gen:types`, no `yarn build:packages`. Spike sources are `.jsx` (no tsconfig), config is `.mts` (transpiled by Vite, never typechecked).
- Reuse root `node_modules`: no new `yarn install`, no `yarn.lock` change, no workspace changes.

## Key findings (from `.doc/spike_mutate.md` + repo inspection)

1. **Layer 1 already works**: `@excalidraw/*` symlinks exist in root `node_modules` (`node_modules/@excalidraw/excalidraw -> packages/excalidraw`, etc.). Node's upward resolution from `spikes/mutateAPI/` finds them — `spikes/*` does **not** need to be added to workspaces.
2. **Layer 2 is required**: package `main`/`module` point at unbuilt `dist/prod`. The spike's Vite config must carry the same `resolve.alias` table as `excalidraw-app/vite.config.mts:24-96` (bare + subpath aliases → package **source**). The source packages import each other via bare specifiers (`@excalidraw/element`, `@excalidraw/common`, …), so the full table is needed, not just `@excalidraw/excalidraw`.
3. **Layer 3 not needed**: no typechecking in this spike; root `tsc` only includes `packages` + `excalidraw-app` (`tsconfig.json` `include`), so it never sees `spikes/`.
4. **CSS comes for free**: `packages/excalidraw/index.tsx:34-36` imports `./css/app.scss`, `./css/styles.scss`, `./fonts/fonts.css` — styles load with the JS import. Do **not** import `@excalidraw/excalidraw/index.css`; it resolves to `dist/*.css` which doesn't exist (source-side there is no `packages/excalidraw/index.css`).
5. **No svgr needed**: no `.svg`-as-component imports anywhere in `packages/` or `excalidraw-app/`.
6. **`sass` is already at root** (`node_modules/sass`) — SCSS compiles without extra setup.
7. **yarn caveat (verified empirically)**: `yarn --cwd spikes/mutateAPI start` does **not** put the root `node_modules/.bin` on PATH (yarn 1, even with workspace membership). `npm --prefix … run` _does_ walk ancestor `.bin`. Therefore the primary run entry is a **root script** (root `yarn run` has root `.bin` on PATH by construction).
8. Ports: excalidraw-app/examples use 3000/3001 (`.env.development` `VITE_APP_PORT=3001`, `examples/with-script-in-browser/vite.config.mts`). Spike takes **3002**.

## Files to create

```
spikes/mutateAPI/
├── package.json
├── vite.config.mts
├── index.html
└── src/
    └── main.jsx
```

(No `.gitignore` needed — root `.gitignore` already covers `build`, `dist`, `node_modules`.)

### `spikes/mutateAPI/package.json`

```json
{
  "name": "spikes-mutate-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5002"
  }
}
```

No `dependencies` field: react/react-dom/vite/@vitejs/plugin-react and the `@excalidraw/*` symlinks are all resolved by walking up to the root `node_modules`. Declaring deps without installing them would only invite a stray nested install.

### `spikes/mutateAPI/vite.config.mts`

```ts
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: { port: 3002 },
  // same as excalidraw-app/vite.config.mts — root .env.development/.env.production
  envDir: path.resolve(__dirname, "../../"),
  resolve: {
    // copy the resolve.alias array VERBATIM from excalidraw-app/vite.config.mts:24-96
    alias: [
      /* …full table: @excalidraw/{common,element,excalidraw,math,utils,fractional-indexing,laser-pointer}, @excalimath/core… */
    ],
  },
  plugins: [react()],
});
```

Notes:

- Copy the alias table verbatim (do not trim it — proven set, see `.doc/spike_mutate.md` §2).
- `__dirname` works because neither root nor spike `package.json` sets `"type": "module"`, so Vite bundles the config as CJS (same situation as `excalidraw-app/vite.config.mts`).
- No `publicDir` override, no `build.outDir` override (defaults: `public`, `dist`).

### `spikes/mutateAPI/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>spike: mutateAPI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `spikes/mutateAPI/src/main.jsx`

```jsx
import { createRoot } from "react-dom/client";
import { Excalidraw } from "@excalidraw/excalidraw";

createRoot(document.getElementById("root")).render(
  <div style={{ height: "100vh" }}>
    <Excalidraw />
  </div>,
);
```

Parent must have non-zero height (Excalidraw fills 100% of parent) — hence `100vh`. No CSS import (see finding 4). No `ExcalidrawAPIProvider` — bare mount.

## File to edit

### Root `package.json` — add two scripts

```jsonc
"start:spike:mutate": "vite spikes/mutateAPI",
"build:spike:mutate": "vite build spikes/mutateAPI",
```

`vite [root]` / `vite build [root]` load config and `index.html` from that root; running via root `yarn run` guarantees the root `node_modules/.bin` is on PATH.

## Commands

```bash
# dev (primary — from repo root)
yarn start:spike:mutate        # → http://localhost:3002

# dev (spike-local alternative; npm walks ancestor .bin, yarn does not)
npm run start --prefix spikes/mutateAPI

# production build (plain vite build; emits spikes/mutateAPI/dist only)
yarn build:spike:mutate
```

## Verification

1. `yarn start:spike:mutate` boots without resolve errors; open `http://localhost:3002`.
2. `curl -s http://localhost:3002/src/main.jsx | grep excalidraw` — the bare specifier must be rewritten to `/@fs/…/packages/excalidraw/index.tsx` (alias layer active).
3. UI: toolbar is styled (SCSS pipeline OK), draw/select/move a rectangle on the canvas.
4. `yarn build:spike:mutate` → `spikes/mutateAPI/dist/` contains `index.html` + js **and css** assets; confirm no `packages/*/dist`, `dist/types` were created and `yarn.lock` is untouched.
5. Repo hygiene:
   - `npx prettier --check spikes/mutateAPI/**/*.{json,html} task_plan.md` (root `test:other` globs `**/*.{json,html,md,...}`)
   - `yarn test:code` and `yarn test:typecheck` still pass (both only scan `.js/.ts/.tsx` and `packages`+`excalidraw-app` respectively — spike files are `.jsx`/`.mts`)
6. `git status` shows only: `spikes/mutateAPI/*`, `package.json`, `task_plan.md`.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `vite: not found` | Use root script `yarn start:spike:mutate`, or spike-local `npm run start --prefix spikes/mutateAPI` (yarn 1 does not add ancestor `.bin`, verified). |
| Resolve error pointing at `packages/*/dist/…` | An alias entry is missing — add it per `.doc/spike_mutate.md` §5 (bare + subpath). |
| esbuild “arbitrary module namespace identifier names” during dep scan | Add `optimizeDeps: { esbuildOptions: { target: "es2022" } }` (same as `examples/with-script-in-browser/vite.config.mts`). |
| sass legacy-JS-API deprecation warnings | Cosmetic; ignore. |
| Unstyled UI / missing fonts | Check that the alias resolves `@excalidraw/excalidraw` → `packages/excalidraw/index.tsx` (styles are imported there); do **not** add `@excalidraw/excalidraw/index.css`. |

## Out of scope

- Any `mutateAPI` experimentation logic itself (this plan only delivers the host canvas).
- Adding `spikes/*` to workspaces, root `yarn install`, `yarn.lock` changes.
- Building package `dist/` output or emitting any types.
- Collab/PWA/svgr or other `excalidraw-app` plugins.
