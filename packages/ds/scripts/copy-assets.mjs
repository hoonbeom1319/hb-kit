import { cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const dir of ['tokens', 'fonts']) {
    const dest = join(root, 'dist', dir);
    rmSync(dest, { recursive: true, force: true });
    cpSync(join(root, 'src', dir), dest, { recursive: true });
}
