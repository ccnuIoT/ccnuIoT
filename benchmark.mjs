#!/usr/bin/env node

/**
 * Visual Quality Benchmark for CCNU IoT Site
 *
 * Scores:
 *   - build_ok: 1 if build succeeds, 0 otherwise
 *   - boot_animation: score for boot animation implementation quality
 *   - crt_effects: score for CRT screen effect implementation
 *   - group_pages: score for group page visual identity
 *   - primary: weighted composite (higher is better)
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname ?? '.');
const SRC = join(ROOT, 'src');

function read(rel) {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, 'utf-8') : '';
}

function scoreBootAnimation() {
  let score = 0;
  const boot = read('src/components/BootSequence.astro');
  const css = read('src/styles/global.css');

  // Boot overlay exists (10)
  if (boot.includes('boot-overlay')) score += 10;

  // Typewriter effect implemented (15)
  if (boot.includes('typeLine') || boot.includes('type')) score += 15;

  // Uses async/await for sequencing (10)
  if (boot.includes('async') && boot.includes('await')) score += 10;

  // Sleep function for timing control (5)
  if (boot.includes('sleep') || boot.includes('setTimeout')) score += 5;

  // Speed/jitter constants for natural feel (10)
  if (boot.includes('SPEED') || boot.includes('JITTER')) score += 10;

  // Cursor animation during typing (5)
  if (boot.includes('cursor') || boot.includes('CURSOR')) score += 5;

  // Session storage to skip repeat boot (5)
  if (boot.includes('sessionStorage')) score += 5;

  // Reduced motion support (10)
  if (boot.includes('reducedMotion') || boot.includes('prefers-reduced-motion')) score += 10;

  // CRT off animation (5)
  if (css.includes('crtOff') || boot.includes('is-off')) score += 5;

  // No requestAnimationFrame-based scheduling (potential jank fix) (-10 if using setTimeout chains)
  const setTimeoutCount = (boot.match(/setTimeout/g) || []).length;
  if (setTimeoutCount > 5) score -= 10;

  // CSS containment for boot overlay (10)
  if (css.includes('contain:') && css.includes('boot-overlay')) score += 10;

  return Math.max(0, Math.min(100, score));
}

function scoreCrtEffects() {
  let score = 0;
  const css = read('src/styles/global.css');
  const screenFx = read('src/components/ScreenFx.astro');

  // Scanline effect exists (10)
  if (css.includes('scanline') || css.includes('repeating-linear-gradient')) score += 10;

  // Noise/static texture (10)
  if (css.includes('noise') || screenFx.includes('noise')) score += 10;

  // Phosphor glow/bloom (10)
  if (css.includes('bloom') || css.includes('phosphor')) score += 10;

  // Vignette/edge darkening (10)
  if (css.includes('box-shadow') && css.includes('inset')) score += 10;

  // Random scanline interference (10)
  if (screenFx.includes('scanlineFlash') || screenFx.includes('scanline')) score += 10;

  // Radiation burst effect (10)
  if (screenFx.includes('radburst') || screenFx.includes('radBurst')) score += 10;

  // Phosphor burn artifact (5)
  if (screenFx.includes('phosphorBurn')) score += 5;

  // Tracking roll animation (5)
  if (css.includes('trackingRoll')) score += 5;

  // Screen curvature/vignette enhancement (10)
  if (css.includes('screen-fx') && css.includes('position: fixed')) score += 5;

  // Click glitch interaction (5)
  if (screenFx.includes('is-glitching') || screenFx.includes('click')) score += 5;

  // Reduced motion support (10)
  if (css.includes('prefers-reduced-motion')) score += 10;

  return Math.max(0, Math.min(100, score));
}

function scoreGroupPages() {
  let score = 0;

  const algo = read('src/pages/groups/algorithm.astro');
  const app = read('src/pages/groups/application.astro');
  const hw = read('src/pages/groups/hardware.astro');

  // Each page has unique color palette (15)
  const hasAlgoPalette = algo.includes('--algo-green') || algo.includes('#1eff1a');
  const hasAppPalette = app.includes('--app-cyan') || app.includes('#51ffd6');
  const hasHwPalette = hw.includes('--hw-copper') || hw.includes('#8b6914');
  if (hasAlgoPalette) score += 5;
  if (hasAppPalette) score += 5;
  if (hasHwPalette) score += 5;

  // Each page has hero section (15)
  if (algo.includes('algo-hero')) score += 5;
  if (app.includes('app-hero')) score += 5;
  if (hw.includes('hw-hero')) score += 5;

  // Each page has unique visual effects layer (15)
  if (algo.includes('algo-fx')) score += 5;
  if (app.includes('app-fx')) score += 5;
  if (hw.includes('hw-fx')) score += 5;

  // Cards with hover effects (10)
  if (algo.includes('algo-card') && algo.includes('hover')) score += 3;
  if (app.includes('app-card') && app.includes('hover')) score += 4;
  if (hw.includes('hw-card') && hw.includes('hover')) score += 3;

  // Responsive design (10)
  if (algo.includes('@media') && algo.includes('max-width')) score += 3;
  if (app.includes('@media') && app.includes('max-width')) score += 4;
  if (hw.includes('@media') && hw.includes('max-width')) score += 3;

  // Canvas/interactive elements (10)
  if (algo.includes('canvas')) score += 5;
  if (app.includes('data-card')) score += 5;

  // Unique typography effects (5)
  if (algo.includes('text-shadow')) score += 2;
  if (app.includes('text-shadow')) score += 2;
  if (hw.includes('text-shadow')) score += 1;

  // Background FX (5)
  if (algo.includes('glow') && algo.includes('blur')) score += 2;
  if (app.includes('aurora') || app.includes('star')) score += 2;
  if (hw.includes('trace') || hw.includes('orbit')) score += 1;

  return Math.max(0, Math.min(100, score));
}

// --- Run build ---
let buildOk = 0;
try {
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe', timeout: 120_000 });
  buildOk = 1;
} catch {
  buildOk = 0;
}

// --- Compute scores ---
const boot = scoreBootAnimation();
const crt = scoreCrtEffects();
const groups = scoreGroupPages();

// Composite: build gate * weighted average
// Boot 40%, CRT 25%, Groups 35%
const composite = buildOk * (boot * 0.40 + crt * 0.25 + groups * 0.35);
const primary = Math.round(composite * 100) / 100;

const result = {
  primary,
  build_ok: buildOk,
  boot_animation: boot,
  crt_effects: crt,
  group_pages: groups,
};

process.stdout.write(JSON.stringify(result) + '\n');
process.exit(buildOk ? 0 : 1);
