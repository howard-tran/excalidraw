<a href="https://excalidraw.com/" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" alt="Excalidraw" srcset="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github/excalidraw_github_cover_2_dark.png" />
    <img alt="Excalidraw" src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github/excalidraw_github_cover_2.png" />
  </picture>
</a>

<h4 align="center">
  <a href="https://excalidraw.com">Excalidraw Editor</a> |
  <a href="https://plus.excalidraw.com/blog">Blog</a> |
  <a href="https://docs.excalidraw.com">Documentation</a> |
  <a href="https://plus.excalidraw.com">Excalidraw+</a>
</h4>

<div align="center">
  <h2>
    An open source virtual hand-drawn style whiteboard. </br>
    Collaborative, end-to-end encrypted, <b>and math-ready.</b> </br>
  <br />
  </h2>
</div>

<br />
<p align="center">
  <a href="https://github.com/excalidraw/excalidraw/blob/master/LICENSE">
    <img alt="Excalidraw is released under the MIT license." src="https://img.shields.io/badge/license-MIT-blue.svg"  /></a>
  <a href="https://www.npmjs.com/package/@excalidraw/excalidraw">
    <img alt="npm downloads/month" src="https://img.shields.io/npm/dm/@excalidraw/excalidraw"  /></a>
  <a href="https://docs.excalidraw.com/docs/introduction/contributing">
    <img alt="PRs welcome!" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat"  /></a>
  <a href="https://discord.gg/UexuTaE">
    <img alt="Chat on Discord" src="https://img.shields.io/discord/723672430744174682?color=738ad6&label=Chat%20on%20Discord&logo=discord&logoColor=ffffff&widget=false"/></a>
  <a href="https://deepwiki.com/excalidraw/excalidraw">
    <img alt="Ask DeepWiki" src="https://deepwiki.com/badge.svg" /></a>
  <a href="https://twitter.com/excalidraw">
    <img alt="Follow Excalidraw on Twitter" src="https://img.shields.io/twitter/follow/excalidraw.svg?label=follow+@excalidraw&style=social&logo=twitter"/></a>
</p>

<div align="center">
  <figure>
    <a href="https://excalidraw.com" target="_blank" rel="noopener">
      <img src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github%2Fproduct_showcase.png" alt="Product showcase" />
    </a>
    <figcaption>
      <p align="center">
        Create beautiful hand-drawn like diagrams, wireframes, or whatever you like.
      </p>
    </figcaption>
  </figure>
</div>

## About this fork

This repository is the official [Excalidraw](https://github.com/excalidraw/excalidraw) codebase with **ExcaliMath** features merged directly in. ExcaliMath — originally a standalone companion plugin by [Tamer](https://github.com/tamerUAE) — adds equations, graphs, and STEM shape libraries natively into the Excalidraw editor.

Everything from upstream is preserved. The math features are offered as drop-in plugins that ship with the app and are also available as a standalone npm package (`@excalimath/core`).

## ExcaliMath Features

### Equation Layer
- **Visual toolbar** — click to insert fractions, integrals, Greek letters, matrices, and more. No LaTeX syntax knowledge needed.
- Write LaTeX directly or use the toolbar — live preview as you type via KaTeX.
- Click any equation on the canvas to reopen and edit it.
- 40+ pre-built expressions across 9 categories.
- Graceful error handling with clear parse-error messages.

### Graph Layer
- Plot functions like `sin(x)`, `x^2 + 2*x` with safe evaluation via mathjs (never uses `eval()`).
- Up to 5 colour-coded functions per graph.
- Configurable axes: range, labels, grid, tick intervals.
- Transparent or custom background colour.
- CSV data import for scatter and line plots.
- 7 preset templates: linear, parabola, trig, unit circle, number line, exponential, absolute value.
- Click-to-edit restores full graph configuration.

### Shape Libraries
- **Geometry** (K-10): Triangles, circles, polygons, coordinate grid, number line, protractor.
- **Algebra** (Gr 3-10): Fraction bars, algebra tiles, Venn diagrams, function machine.
- **Statistics** (Gr 5-12): Bar chart, pie chart, histogram, scatter plot, box plot.
- **Physics / Circuits** (Gr 8-12): 30 components — resistors, capacitors, transistors (NPN/PNP), all 7 logic gates, meters, diodes, and more.
- **Biology** (Gr 5-12): Cell diagrams, DNA helix, mitosis stages, food web.
- **Chemistry** (Gr 7-12): Bohr atom, periodic table tile, bond types, lab equipment.
- Search across all packs, toggle packs on/off, import custom `.excalidrawlib` files.

## Core Excalidraw Features

- 💯&nbsp;Free & open-source.
- 🎨&nbsp;Infinite, canvas-based whiteboard.
- ✍️&nbsp;Hand-drawn like style.
- 🌓&nbsp;Dark mode.
- 🏗️&nbsp;Customizable.
- 📷&nbsp;Image support.
- 😀&nbsp;Shape libraries support.
- 🌐&nbsp;Localization (i18n) support.
- 🖼️&nbsp;Export to PNG, SVG & clipboard.
- 💾&nbsp;Open format - export drawings as an `.excalidraw` json file.
- ⚒️&nbsp;Wide range of tools - rectangle, circle, diamond, arrow, line, free-draw, eraser...
- ➡️&nbsp;Arrow-binding & labeled arrows.
- 🔙&nbsp;Undo / Redo.
- 🔍&nbsp;Zoom and panning support.

## Excalidraw.com

The app hosted at [excalidraw.com](https://excalidraw.com) is a minimal showcase of what you can build with Excalidraw. Its [source code](https://github.com/excalidraw/excalidraw/tree/master/excalidraw-app) is part of this repository as well, and the app features:

- 📡&nbsp;PWA support (works offline).
- 🤼&nbsp;Real-time collaboration.
- 🔒&nbsp;End-to-end encryption.
- 💾&nbsp;Local-first support (autosaves to the browser).
- 🔗&nbsp;Shareable links (export to a readonly link you can share with others).

We'll be adding these features as drop-in plugins for the npm package in the future.

## Quick start

### Running locally

```bash
git clone https://github.com/howard-tran/excalidraw.git
cd excalidraw
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the editor with ExcaliMath enabled.

### Integrating as an npm package

```bash
npm install react react-dom @excalidraw/excalidraw
# or
yarn add react react-dom @excalidraw/excalidraw
```

For more details, see the [Excalidraw documentation](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation).

### Using ExcaliMath standalone

```bash
npm install @excalimath/core
```

```tsx
import { useState, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcaliMath } from "@excalimath/core";
import type { ExcalimathSceneData } from "@excalimath/core";

export function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const handleExcalidrawAPI = useCallback((api: any) => {
    setExcalidrawAPI(api);
  }, []);

  const handleSave = useCallback((data: ExcalimathSceneData) => {
    // In a real app, persist this to localStorage, a server, etc.
    console.log("[ExcaliMath] Scene saved:", data.elements.length, "elements");
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Excalidraw
        excalidrawAPI={handleExcalidrawAPI}
        renderTopRightUI={() =>
          excalidrawAPI ? (
            <ExcaliMath
              excalidrawAPI={excalidrawAPI}
              enabledPlugins={["equation", "graph", "library"]}
              theme="auto"
              onSave={handleSave}
            />
          ) : null
        }
      />
    </div>
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `excalidrawAPI` | `ExcalidrawImperativeAPI` | required | The Excalidraw API ref |
| `enabledPlugins` | `Array<"equation" \| "graph" \| "library">` | all enabled | Which plugins to show |
| `theme` | `"light" \| "dark" \| "auto"` | `"auto"` | Theme override |
| `initialData` | `ExcalimathSceneData` | — | Load a saved scene with auto-restore |
| `onSave` | `(data) => void` | — | Called on every insert/update for persistence |

## Project structure

```
excalidraw/
├── excalidraw-app/          Web app (excalidraw.com)
├── packages/
│   ├── excalidraw/          Core editor component
│   ├── excalimath/          Math companion plugin (equations, graphs, shapes)
│   │   └── src/
│   │       ├── core/        Element factory, state bridge, round-trip save/load
│   │       ├── plugins/     Equation (KaTeX), Graph (Plotly), Geometry (shape packs)
│   │       └── ui/          ExcaliMath sidebar, panels, theme tokens
│   ├── math/                Low-level math utilities (@excalidraw/math)
│   ├── element/             Element type definitions
│   ├── common/              Shared types and utilities
│   ├── utils/               Common utilities
│   ├── fractional-indexing/ Ordering library
│   └── laser-pointer/       Laser pointer overlay
└── scripts/                 Build and dev scripts
```

## Tech stack

| Concern | Library |
|---------|---------|
| Equation rendering | KaTeX 0.16+ |
| Graph plotting | Plotly.js (SVG mode) |
| Function evaluation | mathjs (safe — no `eval()`) |
| Framework | React 18 |
| Build | Vite + TypeScript (strict) |
| Desktop (optional) | Electrobun |

## Contributing

- Missing something or found a bug? [Report here](https://github.com/excalidraw/excalidraw/issues).
- Want to contribute? Check out our [contribution guide](https://docs.excalidraw.com/docs/introduction/contributing) or let us know on [Discord](https://discord.gg/UexuTaE).
- Want to help with translations? See the [translation guide](https://docs.excalidraw.com/docs/introduction/contributing#translating).

## Credits

- **Excalidraw** — the core whiteboard editor, maintained by the [Excalidraw team](https://github.com/excalidraw).
- **ExcaliMath** — math companion plugin, created by [Tamer](https://github.com/tamerUAE) at ITWorx EdTech. ([Original repo](https://github.com/tamerUAE/excalimath))

## Sponsors & support

If you like the project, you can become a sponsor at [Open Collective](https://opencollective.com/excalidraw) or use [Excalidraw+](https://plus.excalidraw.com/).

## Thank you for supporting Excalidraw

[<img src="https://opencollective.com/excalidraw/tiers/sponsors/0/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/0/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/1/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/1/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/2/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/2/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/3/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/3/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/4/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/4/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/5/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/5/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/6/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/6/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/7/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/7/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/8/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/8/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/9/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/9/website) [<img src="https://opencollective.com/excalidraw/tiers/sponsors/10/avatar.svg?avatarHeight=120"/>](https://opencollective.com/excalidraw/tiers/sponsors/10/website)

<a href="https://opencollective.com/excalidraw#category-CONTRIBUTE" target="_blank"><img src="https://opencollective.com/excalidraw/tiers/backers.svg?avatarHeight=32"/></a>

Last but not least, we're thankful to these companies for offering their services for free:

[![Vercel](./.github/assets/vercel.svg)](https://vercel.com) [![Sentry](./.github/assets/sentry.svg)](https://sentry.io) [![Crowdin](./.github/assets/crowdin.svg)](https://crowdin.com)
