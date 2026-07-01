import { createInterface } from 'node:readline/promises';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const wrap = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);

export const c = {
  bold: wrap('1'),
  dim: wrap('2'),
  red: wrap('31'),
  green: wrap('32'),
  yellow: wrap('33'),
  cyan: wrap('36'),
};

export const log = {
  info: (m) => console.log(m),
  step: (m) => console.log(`${c.cyan('›')} ${m}`),
  ok: (m) => console.log(`${c.green('✓')} ${m}`),
  warn: (m) => console.log(`${c.yellow('!')} ${m}`),
  skip: (m) => console.log(`${c.dim('-')} ${c.dim(m)}`),
};

/**
 * Locate the bundled templates directory.
 * - published package:  <pkg>/templates
 * - monorepo dev:       <repo>/templates
 */
export function resolveTemplatesDir() {
  const here = dirname(fileURLToPath(import.meta.url)); // packages/cli/src
  const candidates = [
    resolve(here, '..', '..', '..', 'templates'), // repo root templates (dev SSOT — preferred)
    resolve(here, '..', 'templates'), // packages/cli/templates (published fallback)
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, 'claude', '.claude', 'rules', 'conventions.md'))) {
      return join(dir, 'claude');
    }
  }
  throw new Error(
    'templates를 찾을 수 없습니다. 패키지가 올바르게 설치되지 않았을 수 있어요.',
  );
}

/** Recursively list files (relative paths) under a directory. */
export function listFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base));
    else out.push(full.slice(base.length + 1).split('\\').join('/'));
  }
  return out;
}

/** Ask a yes/no question. Returns boolean. */
export async function confirm(question, fallback = false) {
  if (!process.stdin.isTTY) return fallback;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const hint = fallback ? 'Y/n' : 'y/N';
    const answer = (await rl.question(`${c.yellow('?')} ${question} ${c.dim(`(${hint})`)} `)).trim().toLowerCase();
    if (!answer) return fallback;
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

/** Minimal flag parser: --key, --key=value, --key value, -short. */
export function parseFlags(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, inline] = a.slice(2).split('=');
      if (inline !== undefined) {
        flags[k] = inline;
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        // `--key value` form: consume next token as the value
        flags[k] = argv[++i];
      } else {
        flags[k] = true;
      }
    } else if (a.startsWith('-') && a.length > 1) {
      for (const ch of a.slice(1)) flags[ch] = true;
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}
