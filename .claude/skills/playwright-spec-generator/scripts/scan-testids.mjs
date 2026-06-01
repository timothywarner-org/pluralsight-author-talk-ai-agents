#!/usr/bin/env node
// scan-testids.mjs
//
// Walks an HTML directory tree and produces an inventory of every
// data-testid attribute it finds.
//
// The playwright-spec-generator Skill calls this script as Step 2 of its
// procedure -- BEFORE drafting selectors -- so the subagent never invents
// a testid that doesn't exist in the HTML.
//
// Usage:
//   node scripts/scan-testids.mjs <root-dir> [--format=json|md]
//
// Default <root-dir> is "app/public". Default format is "md".
//
// Exit codes:
//   0 - success
//   1 - root dir does not exist or contains no .html files

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const TESTID_RE = /data-testid=["']([^"']+)["']/g;

const args = process.argv.slice(2);
const rootArg = args.find((a) => !a.startsWith('--')) ?? 'app/public';
const formatArg =
  args.find((a) => a.startsWith('--format='))?.split('=')[1] ?? 'md';

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      yield full;
    }
  }
}

async function scan(root) {
  const inventory = {};
  let fileCount = 0;
  for await (const file of walk(root)) {
    fileCount += 1;
    const html = await readFile(file, 'utf8');
    const rel = relative(process.cwd(), file).split(sep).join('/');
    let match;
    TESTID_RE.lastIndex = 0;
    while ((match = TESTID_RE.exec(html)) !== null) {
      const id = match[1];
      if (!inventory[id]) inventory[id] = [];
      if (!inventory[id].includes(rel)) inventory[id].push(rel);
    }
  }
  return { fileCount, inventory };
}

function renderJson({ fileCount, inventory }) {
  return JSON.stringify({ fileCount, inventory }, null, 2);
}

function renderMd({ fileCount, inventory }) {
  const ids = Object.keys(inventory).sort();
  const lines = [
    `# data-testid inventory`,
    ``,
    `Scanned **${fileCount}** HTML file(s). Found **${ids.length}** unique testid(s).`,
    ``,
    `| testid | file(s) |`,
    `| --- | --- |`,
  ];
  for (const id of ids) {
    lines.push(`| \`${id}\` | ${inventory[id].map((f) => `\`${f}\``).join('<br>')} |`);
  }
  return lines.join('\n');
}

async function main() {
  if (!(await exists(rootArg))) {
    console.error(`scan-testids: directory not found: ${rootArg}`);
    process.exit(1);
  }
  const result = await scan(rootArg);
  if (result.fileCount === 0) {
    console.error(`scan-testids: no .html files under ${rootArg}`);
    process.exit(1);
  }
  const out = formatArg === 'json' ? renderJson(result) : renderMd(result);
  process.stdout.write(out + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
