// Bundle sibling payload folders into the package so a standalone
// `npx @hb-kit/cli` install ships them. Source of truth stays in packages/<name>;
// the copies here (packages/cli/<name>) are gitignored build artifacts.
// Runs automatically on `prepack` (npm pack / publish).
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)); // packages/cli/scripts
const packagesDir = resolve(here, '..', '..'); // packages/
const cliDir = resolve(here, '..'); // packages/cli

const PAYLOADS = ['claude']; // add 'ds', 'hooks' as their commands land

for (const name of PAYLOADS) {
  const src = resolve(packagesDir, name);
  const dest = resolve(cliDir, name);
  if (!existsSync(src)) {
    console.error(`payload 원본을 찾을 수 없습니다: ${src}`);
    process.exit(1);
  }
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  console.log(`✓ payload 번들 완료 → ${dest}`);
}
