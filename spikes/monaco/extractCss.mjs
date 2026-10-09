#!/usr/bin/env node
/**
 * extractCss.mjs — offline regeneration of the `.mtkN` color rules for a
 * monaco-editor standalone theme (no DOM, no bundler).
 *
 * Reference: `.doc/01.md` §15 / §15.3.1 ("Offline / Node script").
 *
 * Why a copy: `monaco-editor` ships CJS-typed `.js` files (no `"type":"module"`
 * in its package.json), so Node refuses to `import` anything under its `esm/`
 * tree directly. We mirror `node_modules/monaco-editor/esm` into a cache dir
 * that carries `{"type":"module"}` and import from there.
 *
 * Usage:
 *   node extractCss.mjs                    # default theme: vs (vs_light)
 *   node extractCss.mjs vs vs-dark hc-black hc-light
 *   node extractCss.mjs vs_light
 *   node extractCss.mjs --list
 *   node extractCss.mjs vs -o vs.mtk.css
 *   node extractCss.mjs ./my-theme.json     # custom `defineTheme` data
 *   node extractCss.mjs vs --refresh        # force re-copy of the esm mirror
 *
 * The output is only valid for the exact monaco build it was generated from
 * (`.doc/01.md` §15.4): ship theme + CSS together, never mix indices across
 * themes.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
console.log(here);

// ---------------------------------------------------------------------------
// Locate monaco-editor and mirror its `esm/` tree as ESM
// ---------------------------------------------------------------------------

// `require.resolve('monaco-editor/package.json')` cannot be used: the package
// exports map routes every `./*` specifier to `./esm/vs/*.js` (package.json:44-50),
// so walk up from this file to `node_modules/monaco-editor` instead.
function resolveMonacoRoot() {
  let dir = here;
  for (;;) {
    const candidate = path.join(dir, 'node_modules', 'monaco-editor', 'package.json');
    if (fs.existsSync(candidate)) return path.dirname(candidate);
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('extractCss: monaco-editor not found in any node_modules above ' + here);
    }
    dir = parent;
  }
}

const monacoRoot = resolveMonacoRoot();
const monacoPkg = JSON.parse(fs.readFileSync(path.join(monacoRoot, 'package.json'), 'utf8'));

const monacoEsmSrc = path.join(monacoRoot, 'esm');
if (!fs.existsSync(monacoEsmSrc)) {
  throw new Error(`extractCss: ${monacoEsmSrc} is missing — is monaco-editor installed fully?`);
}

// node_modules is git-ignored, so the mirror never shows up in `git status`.
const mirrorRoot = path.join(here, 'node_modules', '.cache', 'monaco-esm');
const mirrorEsm = path.join(mirrorRoot, 'esm');
const stampFile = path.join(mirrorRoot, 'stamp.json');

function ensureMirror(refresh) {
  const stamp = JSON.stringify({ version: monacoPkg.version, src: monacoEsmSrc });
  if (!refresh && fs.existsSync(stampFile) && fs.readFileSync(stampFile, 'utf8') === stamp) {
    return;
  }
  process.stderr.write(
    `extractCss: mirroring monaco-editor@${monacoPkg.version} esm -> ${mirrorEsm} ...\n`,
  );
  fs.rmSync(mirrorRoot, { recursive: true, force: true });
  fs.mkdirSync(mirrorRoot, { recursive: true });
  // The marker that makes Node treat the mirrored `.js` files as ESM.
  fs.writeFileSync(path.join(mirrorRoot, 'package.json'), '{ "type": "module" }\n');
  fs.cpSync(monacoEsmSrc, mirrorEsm, { recursive: true });
  fs.writeFileSync(stampFile, stamp);
}

// ---------------------------------------------------------------------------
// Theme data -> TokenTheme -> CSS
// ---------------------------------------------------------------------------

async function loadMonaco(refresh) {
  ensureMirror(refresh);
  const [tokenization, themes] = await Promise.all([
    import(url.pathToFileURL(path.join(mirrorEsm, 'vs/editor/common/languages/supports/tokenization.js')).href),
    import(url.pathToFileURL(path.join(mirrorEsm, 'vs/editor/standalone/common/themes.js')).href),
  ]);
  return { ...tokenization, ...themes };
}

// builtin theme name -> export name in esm/vs/editor/standalone/common/themes.js
const BUILTIN = {
  vs: 'vs', // themes.js:19-20  const vs = { base: 'vs', ... }
  vs_light: 'vs',
  'vs-light': 'vs',
  vs_dark: 'vs_dark',
  'vs-dark': 'vs_dark',
  hc_black: 'hc_black',
  'hc-black': 'hc_black',
  hc_light: 'hc_light',
  'hc-light': 'hc_light',
};

/** Mirrors the `StandaloneTheme.tokenTheme` getter
 *  (esm/vs/editor/standalone/browser/standaloneThemeService.js:118-146). */
function tokenThemeOf(TokenTheme, themeData) {
  if (themeData.inherit) {
    // Builtin themes all have `inherit: false`; custom themes inheriting a
    // builtin base would need `getBuiltinRules()` spliced in first.
    throw new Error(
      'extractCss: `inherit: true` theme data is not supported — inline the base rules first.',
    );
  }
  let rules = [];
  const fg = themeData.colors?.['editor.foreground'];
  const bg = themeData.colors?.['editor.background'];
  if (fg || bg) {
    const rule = { token: '' };
    if (fg) rule.foreground = fg;
    if (bg) rule.background = bg;
    rules.push(rule);
  }
  rules = rules.concat(themeData.rules ?? []);
  return TokenTheme.createFromRawTokenTheme(rules, themeData.encodedTokensColors ?? []);
}

function loadThemeFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const name = path.basename(file, path.extname(file));
  if (!data.base) {
    throw new Error(`extractCss: ${file} has no \`base\` field (expected 'vs' | 'vs-dark' | ...)`);
  }
  return [name, data];
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { themes: [], out: null, refresh: false, list: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--out') args.out = argv[++i];
    else if (a === '--refresh') args.refresh = true;
    else if (a === '--list') args.list = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else if (a.startsWith('-')) throw new Error(`extractCss: unknown option ${a}`);
    else args.themes.push(a);
  }
  return args;
}

const HELP = `extractCss.mjs — regenerate \`.mtkN\` CSS for monaco standalone themes

  node extractCss.mjs [theme ...] [-o out.css] [--refresh] [--list]

Themes: ${Object.keys(BUILTIN).join(', ')}
        (or a path to a custom \`defineTheme\` JSON file)
Default theme: vs  (a.k.a. vs_light, base: 'vs')`;

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  process.stdout.write(HELP + '\n');
  process.exit(0);
}

const mod = await loadMonaco(args.refresh);

if (args.list) {
  for (const [alias, exportName] of Object.entries(BUILTIN)) {
    const data = mod[exportName];
    process.stdout.write(
      `${alias.padEnd(9)} base=${data.base} rules=${data.rules.length} (themes.js export: ${exportName})\n`,
    );
  }
  process.exit(0);
}

const wanted = args.themes.length ? args.themes : ['vs'];
const chunks = [];
for (const name of wanted) {
  let themeName;
  let themeData;
  if (name.endsWith('.json')) {
    [themeName, themeData] = loadThemeFile(name);
  } else {
    const exportName = BUILTIN[name];
    if (!exportName) {
      throw new Error(`extractCss: unknown theme "${name}" (try --list)`);
    }
    themeName = name;
    themeData = mod[exportName];
  }
  const colorMap = tokenThemeOf(mod.TokenTheme, themeData).getColorMap();
  chunks.push(
    `/* ==== theme: ${themeName} (base: ${themeData.base}, monaco-editor@${monacoPkg.version}, colorMap size ${colorMap.length}) ==== */\n` +
      mod.generateTokensCSSForColorMap(colorMap),
  );
}

const css = chunks.join('\n') + '\n';
if (args.out) {
  fs.writeFileSync(args.out, css);
  process.stderr.write(`extractCss: wrote ${args.out}\n`);
} else {
  process.stdout.write(css);
}
