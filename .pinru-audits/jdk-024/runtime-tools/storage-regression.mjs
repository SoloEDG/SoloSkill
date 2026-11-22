import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

const project = '/Users/cool/work/self-project/solo/SoloSkill/origin-project/jdk-024';
const requireProject = createRequire(path.join(project, 'package.json'));
const { build } = requireProject('esbuild');
const output = path.join(import.meta.dirname, 'use-game.cjs');
await build({
  entryPoints: [path.join(project, 'src/app/useGame.ts')],
  outfile: output,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: ['react', 'react/*'],
  logLevel: 'silent',
});
const require = createRequire(import.meta.url);
const { useGame } = require(output);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.window = new EventTarget();
globalThis.document = new EventTarget();
globalThis.document.hidden = false;
globalThis.requestAnimationFrame = () => 1;
globalThis.cancelAnimationFrame = () => {};

async function mount(raw, { readFailure = false, writeFailure = false } = {}) {
  let stored = raw;
  let writes = 0;
  let current;
  globalThis.localStorage = {
    getItem() {
      if (readFailure) throw new Error('read unavailable');
      return stored;
    },
    setItem(_key, value) {
      writes += 1;
      if (writeFailure) throw new Error('write unavailable');
      stored = value;
    },
  };
  function Probe() {
    current = useGame();
    return null;
  }
  let root;
  await act(async () => { root = TestRenderer.create(React.createElement(Probe)); });
  return {
    get state() { return current; },
    get raw() { return stored; },
    get writes() { return writes; },
    async change() {
      await act(async () => { current.send({ type: 'power', value: 0.7 }); });
    },
    async close() { await act(async () => { root.unmount(); }); },
  };
}

const baseline = process.argv.includes('--baseline');
const fresh = await mount(null);
assert.equal(fresh.state.saved, true);
assert.ok(fresh.writes > 0);
const valid = fresh.raw;
await fresh.close();
console.log('PASS new player automatically saves');

for (const [name, raw, options] of [
  ['invalid JSON', '{broken', {}],
  ['unknown version', JSON.stringify({ ...JSON.parse(valid), version: 99 }), {}],
  ['invalid fields', JSON.stringify({ ...JSON.parse(valid), stock: null }), {}],
  ['read failure', 'unreadable original', { readFailure: true }],
]) {
  const session = await mount(raw, options);
  await session.change();
  const preserved = session.raw === raw && session.writes === 0;
  console.log(`${baseline ? 'BASELINE' : 'CHECK'} ${name} preserved=${preserved} writes=${session.writes}`);
  if (!baseline) {
    assert.equal(preserved, true, name);
    assert.equal(session.state.saved, false, name);
    assert.equal(session.state.state.doc.power, 0.7, 'temporary play remains usable');
  }
  await session.close();
}

const restored = await mount(valid);
assert.equal(restored.state.state.doc.seed, JSON.parse(valid).seed);
await restored.change();
assert.equal(JSON.parse(restored.raw).power, 0.7);
assert.equal(restored.state.saved, true);
await restored.close();
console.log('PASS valid document restores and continues saving');

const unavailable = await mount(valid, { writeFailure: true });
assert.equal(unavailable.state.saved, false);
assert.equal(unavailable.raw, valid);
await unavailable.close();
console.log('PASS write failure is visible and keeps stored data');
