#!/usr/bin/env node
// build.js — Ranuk Orbit bundle builder
//
// Bundles ranuk-app.jsx + all its imports into a single minified IIFE.
// The JSX files register their exports on `window` directly via
// `Object.assign(window, …)`, so we do NOT use --global-name (that would
// shadow `window` itself on the top level).
//
// Run:   node build.js
// Output: ranuk-app.min.js
const { execSync } = require('child_process');
const { resolve } = require('path');

console.log('Building ranuk-app.min.js...');

try {
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
    ].join(' '),
    { stdio: 'inherit', cwd: resolve(__dirname) }
  );
  console.log('✓ Build complete');
} catch (e) {
  console.error('Build failed:', e.message);
  process.exit(1);
}
