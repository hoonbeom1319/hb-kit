// Copy the repo-root SSOT templates into the package so they ship with npm.
// Runs automatically on `prepack` (npm pack / publish).
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)); // packages/cli/scripts
const src = resolve(here, '..', '..', '..', 'templates');
const dest = resolve(here, '..', 'templates');

if (!existsSync(src)) {
  console.error(`templates 원본을 찾을 수 없습니다: ${src}`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log(`✓ templates 동기화 완료 → ${dest}`);
