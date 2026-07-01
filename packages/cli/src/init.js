import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { c, confirm, listFiles, log, resolveTemplatesDir } from './util.js';

const CONVENTIONS_FILE = 'conventions.md';
const CLAUDE_FILE = 'CLAUDE.md';

// Appended to an EXISTING CLAUDE.md as a human-facing pointer.
// conventions.md lives in .claude/rules/ so Claude Code auto-loads it at
// session start regardless of this block — this is for discoverability only,
// and never touches whatever the user already wrote above it.
const REFERENCE_BLOCK = `

<!-- hb-kit -->
## 컨벤션

코드 작성·파일 배치·네이밍은 [\`.claude/rules/conventions.md\`](.claude/rules/conventions.md) 를 단일 진실 공급원(SSOT)으로 따른다.
(\`.claude/rules/\`에 있어 세션 시작 시 자동 로드된다 — 위 링크는 사람용 안내다.)
`;

/**
 * `hb-kit init` — scaffold conventions.md (+ CLAUDE.md) into the target project.
 *
 * Flags:
 *   --dir <path>   target directory (default: cwd)
 *   --force, -f    overwrite conventions.md without asking (never clobbers an
 *                  existing CLAUDE.md — that one is only ever appended to)
 *   --yes,   -y    assume yes for every prompt
 */
export async function init({ flags }) {
  const targetRoot = resolve(process.cwd(), flags.dir === true ? '.' : flags.dir ?? '.');
  const force = Boolean(flags.force || flags.f);
  const assumeYes = Boolean(flags.yes || flags.y);

  const srcDir = resolveTemplatesDir();
  const files = listFiles(srcDir);

  log.info('');
  log.info(c.bold('hb-kit init'));
  log.info(c.dim(`대상: ${targetRoot}`));
  log.info('');

  const ctx = { targetRoot, srcDir, force, assumeYes };
  let written = 0;
  let skipped = 0;

  for (const rel of files) {
    const result =
      basename(rel) === CLAUDE_FILE
        ? await handleClaude(rel, ctx)
        : await handleManaged(rel, ctx);
    if (result === 'written') written++;
    else skipped++;
  }

  log.info('');
  log.info(
    `${c.green(`${written}개 적용`)}${skipped ? c.dim(`, ${skipped}개 건너뜀`) : ''}`,
  );
  log.info('');
  log.info(c.bold('다음 단계'));
  log.info(`  ${c.dim('1.')} CLAUDE.md 하단에 프로젝트별 규칙을 추가하세요.`);
  log.info(`  ${c.dim('2.')} 컨벤션 수정은 ${CONVENTIONS_FILE} 에서.`);
  log.info('');
}

/** conventions.md 등 hb-kit가 관리하는 파일: 충돌 시 물어보고 덮어쓴다. */
async function handleManaged(rel, { targetRoot, srcDir, force, assumeYes }) {
  const from = join(srcDir, rel);
  const to = join(targetRoot, rel);
  const shown = relative(targetRoot, to).split('\\').join('/');

  if (existsSync(to) && !force) {
    const overwrite =
      assumeYes || (await confirm(`${c.bold(shown)} 이(가) 이미 있어요. 최신 내용으로 덮어쓸까요?`, true));
    if (!overwrite) {
      log.skip(`건너뜀  ${shown}`);
      return 'skipped';
    }
  }

  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  log.ok(`생성   ${shown}`);
  return 'written';
}

/**
 * CLAUDE.md: 사용자 소유 파일이라 절대 덮어쓰지 않는다.
 * - 없으면 → 템플릿으로 새로 생성
 * - 있고 이미 conventions.md를 참조 → 그대로 둠
 * - 있고 참조 없음 → 기존 내용 유지한 채 참조 한 줄만 추가할지 물어봄
 */
async function handleClaude(rel, { targetRoot, srcDir, assumeYes }) {
  const from = join(srcDir, rel);
  const to = join(targetRoot, rel);
  const shown = relative(targetRoot, to).split('\\').join('/');

  if (!existsSync(to)) {
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    log.ok(`생성   ${shown}`);
    return 'written';
  }

  const current = readFileSync(to, 'utf8');
  if (current.includes(CONVENTIONS_FILE)) {
    log.skip(`이미 ${CONVENTIONS_FILE} 참조함  ${shown}`);
    return 'skipped';
  }

  log.warn(`${c.bold(shown)} 이(가) 이미 있어요.`);
  const append =
    assumeYes ||
    (await confirm(
      `기존 내용은 그대로 두고, ${CONVENTIONS_FILE}를 항상 읽도록 참조 한 줄만 추가할까요?`,
      true,
    ));
  if (!append) {
    log.skip(`건너뜀  ${shown} ${c.dim(`(${CONVENTIONS_FILE}만 설치됨)`)}`);
    return 'skipped';
  }

  writeFileSync(to, current.replace(/\s*$/, '') + REFERENCE_BLOCK);
  log.ok(`참조 추가  ${shown}`);
  return 'written';
}
