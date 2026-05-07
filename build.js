#!/usr/bin/env node
// build.js — Ranuk Orbit bundle builder
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building ranuk-app.min.js...');

try {
  execSync(`npx esbuild ranuk-app.jsx --bundle --minify --outfile=ranuk-app.min.js --format=iife --global-name=window --jsx-factory=React.createElement --jsx-fragment=React.Fragment`, { stdio: 'inherit' });
  console.log('✓ Build complete');
} catch (e) {
  console.error('Build failed:', e.message);
  process.exit(1);
}