import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Git parses quoted/non-ASCII filenames and validates hunks. No patch is applied.
export function referenceChanges(project, patch) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'pinru-reference-check-'));
  const ignored = new Set(['node_modules', 'dist', '.git', 'coverage']);
  const run = args => spawnSync('git', ['apply', ...args], {cwd:scratch, input:patch, encoding:'utf8', maxBuffer:4 * 1024 * 1024});
  try {
    const stats = run(['--numstat', '-z']);
    if (stats.status !== 0) throw new Error(`参考修复diff无效: ${stats.error?.message || stats.stderr.trim()}`);
    fs.cpSync(project, scratch, {recursive:true, filter:source => {
      const first = path.relative(project, source).split(path.sep)[0];
      return !ignored.has(first);
    }});
    const check = run(['--check', '--whitespace=nowarn']);
    if (check.status !== 0) throw new Error(`参考修复无法应用到当前基线: ${check.error?.message || check.stderr.trim()}`);
    return stats.stdout.split('\0').flatMap(entry => {
      const match = entry.match(/^(\d+)\t(\d+)\t([\s\S]+)$/);
      return match && Number(match[1]) + Number(match[2]) > 0 ? [match[3]] : [];
    });
  } finally { fs.rmSync(scratch, {recursive:true, force:true}); }
}
