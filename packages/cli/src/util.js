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
 * Locate a sibling payload folder (`packages/<name>`) that this CLI installs.
 * Each command prefix has its own peer folder (claude/, ds/, hooks/ …) that the
 * CLI references by relative path — it is not published. Two candidates cover
 * both run contexts:
 *   - monorepo dev:  packages/<name>        (the SSOT peer, next to packages/cli)
 *   - npx install:   packages/cli/<name>    (a build copy bundled at prepack)
 */
export function resolvePayloadDir(name) {
  const here = dirname(fileURLToPath(import.meta.url)); // packages/cli/src
  const candidates = [
    resolve(here, '..', '..', name), // packages/<name> (dev SSOT — preferred)
    resolve(here, '..', name), // packages/cli/<name> (published bundle)
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  throw new Error(
    `${name} payload를 찾을 수 없습니다. packages/${name} 이 있는지 확인하세요.`,
  );
}

// npm always bundles these package-metadata files alongside the payload —
// they aren't part of what gets scaffolded, so skip them (and node_modules).
const NON_PAYLOAD = new Set([
  'node_modules',
  'package.json',
  'readme.md',
  'license',
  'license.md',
  'changelog.md',
]);

/** Recursively list payload files (relative paths), skipping package metadata. */
export function listFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (NON_PAYLOAD.has(name.toLowerCase())) continue;
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
