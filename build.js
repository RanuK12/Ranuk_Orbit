#!/usr/bin/env node
// build.js — Ranuk Orbit bundle builder
//
// Bundles ranuk-app.jsx + all its imports into a single minified IIFE,
// then content-hashes every critical JS/CSS asset and rewrites the
// <script>/<link> tags in index.html to append ?v=<hash>. Finally
// re-runs build-locales.py so /en/, /es/ and /it/ inherit the same
// versioned URLs.
//
// Why: browsers cache /ranuk-app.min.js, /ranuk-data.js, etc. for an
// hour (see _headers). Without cache-busting, users stay on the stale
// bundle until their cache expires. Content-hashed query strings force
// a fresh fetch whenever the file's content changes, while leaving the
// cache intact across deploys that didn't touch a particular file.
//
// Run:    node build.js
// Output: ranuk-app.min.js (minified bundle)
//         index.html, en/index.html, es/index.html, it/index.html
//           (with ?v=<hash> suffixed on every versioned asset)
const { execSync } = require('child_process');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { createHash } = require('crypto');
const { resolve, join } = require('path');
const ROOT = resolve(__dirname);

// Assets that should be cache-busted. Anything the user might see break
// when cached: the JSX bundle, the data layer, the asset manifest, and
// the marketing CSS. Fonts/images are hashed in their filenames already
// via the slug helper, so they don't need versioning.
const VERSIONED_ASSETS = [
  'ranuk-app.min.js',
  'ranuk-data.js',
  'ranuk-manifest.js',
  'MARKETING_CSS.css',
];

function step(label, fn) {
  process.stdout.write(`→ ${label}…`);
  try {
    const result = fn();
    process.stdout.write(' ok\n');
    return result;
  } catch (e) {
    process.stdout.write(' FAILED\n');
    throw e;
  }
}

// 1) Bundle the JSX
step('bundle ranuk-app.min.js', () => {
  execSync(
    [
      'npx esbuild ranuk-app.jsx',
      '--bundle',
      '--minify',
      '--outfile=ranuk-app.min.js',
      '--format=iife',
      '--target=es2019',
      '--loader:.jsx=jsx',
      '--jsx-factory=React.createElement',
      '--jsx-fragment=React.Fragment',
      // Cross-module identifiers: each .jsx declares its symbols with
      // `Object.assign(window, { … })` at the bottom, but other modules
      // reference them as bare identifiers (`useLang()`, `<LangProvider>`,
      // `pick(x, lang)`, etc.). Under `--bundle`, each file gets its own
      // scope, so those bare references point to undefined locals and
      // the app crashes at mount with `ReferenceError`. We fix this with
      // `--define`: esbuild rewrites every free identifier below to
      // `window.<name>` at compile time, so the call sites always go
      // through the runtime global binding populated by the module that
      // owns the symbol.
      '--define:LangProvider=window.LangProvider',
      '--define:useLang=window.useLang',
      '--define:pick=window.pick',
      '--define:COPY=window.COPY',
      '--define:LightboxProvider=window.LightboxProvider',
      '--define:useLightbox=window.useLightbox',
      '--define:Lightbox=window.Lightbox',
      '--define:HeroSection=window.HeroSection',
      '--define:HERO_SEQUENCE=window.HERO_SEQUENCE',
      '--define:Globe=window.Globe',
      '--define:AtlasSection=window.AtlasSection',
      '--define:LOCATIONS_V2=window.LOCATIONS_V2',
      '--define:VISITED_DOTS_V2=window.VISITED_DOTS_V2',
      '--define:ALL_MEDIA_V2=window.ALL_MEDIA_V2',
      '--define:YEARS_V2=window.YEARS_V2',
      '--define:STATS_V2=window.STATS_V2',
      '--define:FAQ_V2=window.FAQ_V2',
      '--define:PROCESS_V2=window.PROCESS_V2',
      '--define:TESTIMONIALS_V2=window.TESTIMONIALS_V2',
      '--define:PRESS_V2=window.PRESS_V2',
      '--define:PROFILE_PHOTOS=window.PROFILE_PHOTOS',
      '--define:RANUK_ASSETS=window.RANUK_ASSETS',
    ].join(' '),
    { stdio: 'inherit', cwd: ROOT }
  );
});

// 2) Compute short content hashes for every versioned asset
const hashes = step('hash versioned assets', () => {
  const out = {};
  for (const name of VERSIONED_ASSETS) {
    const p = join(ROOT, name);
    if (!existsSync(p)) {
      throw new Error(`missing asset: ${name}`);
    }
    const buf = readFileSync(p);
    // 8 hex chars is plenty — collision odds are astronomically low for
    // a 4-asset set and it keeps the URL readable.
    out[name] = createHash('sha256').update(buf).digest('hex').slice(0, 8);
  }
  return out;
});

// 3) Rewrite the canonical index.html so every `<script src="/<asset>">`
// and `<link href="/<asset>">` carries the current content hash. If the
// tag already has ?v=<something> we replace it; otherwise we append.
step('stamp index.html', () => {
  const indexPath = join(ROOT, 'index.html');
  let html = readFileSync(indexPath, 'utf-8');

  for (const [name, hash] of Object.entries(hashes)) {
    // Match  src="/<name>"  or  src="/<name>?v=XXXX"  (and href variant).
    // Escapes keep the regex stable across OSes.
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `((?:src|href)=["'])\\/${escaped}(?:\\?v=[^"']*)?(["'])`,
      'g',
    );
    let matchCount = 0;
    html = html.replace(pattern, (_m, a, b) => {
      matchCount++;
      return `${a}/${name}?v=${hash}${b}`;
    });
    if (matchCount === 0) {
      throw new Error(
        `could not find reference to /${name} in index.html — is the tag missing or oddly formatted?`,
      );
    }
  }

  writeFileSync(indexPath, html, 'utf-8');
});

// 4) Regenerate /en/, /es/, /it/ from the freshly-stamped index.html so
// every locale gets the same cache-busting URLs.
step('regenerate locale HTMLs', () => {
  execSync('python3 build-locales.py', { stdio: 'inherit', cwd: ROOT });
});

console.log('\n✓ Build complete. Asset versions:');
for (const [name, hash] of Object.entries(hashes)) {
  console.log(`  /${name}?v=${hash}`);
}

// 5) Generate version.json for cache-busting auto-reload system
step('generate version.json', () => {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 13);
  const versionData = JSON.stringify({
    version: `${timestamp}-${hashes['ranuk-app.min.js'].slice(0, 6)}`,
    build: timestamp
  });
  writeFileSync(join(ROOT, 'version.json'), versionData, 'utf-8');
});

console.log('  /version.json (auto-reload trigger)');

