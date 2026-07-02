import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { beginInstall, endInstall, installManaged } from './install.js';
import { c, listFiles, log, confirm, resolvePayloadDir } from './util.js';

const CONVENTIONS_FILE = 'conventions.md';
const CLAUDE_FILE = 'CLAUDE.md';
// payload 원본은 .template 이름을 쓴다 — packages/claude 자체는 Next.js 프로젝트가
// 아니라서, CLAUDE.md 그대로 두면 그 폴더에서 작업할 때 엉뚱한 컨벤션이 자동 로드된다.
const CLAUDE_TEMPLATE = 'CLAUDE.template.md';

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
 * `hb-kit claude-init` — scaffold conventions.md (+ CLAUDE.md) into the target project.
 *
 * Flags:
 *   --dir <path>   target directory (default: cwd)
 *   --force, -f    overwrite conventions.md without asking (never clobbers an
 *                  existing CLAUDE.md — that one is only ever appended to)
 *   --yes,   -y    assume yes for every prompt
 */
export async function claudeInit({ flags }) {
  const srcDir = resolvePayloadDir('claude');
  const ctx = beginInstall('claude-init', flags, srcDir);

  // claude-init은 공용 컨벤션(CLAUDE.template.md + rules/)만 설치한다.
  // payload의 나머지(harness-builder/ 등 단위 폴더)는 각자의 명령이 담당한다.
  const files = listFiles(srcDir).filter(
    (f) => f === CLAUDE_TEMPLATE || f.startsWith('rules/'),
  );

  for (const srcRel of files) {
    if (srcRel === CLAUDE_TEMPLATE) await installClaudeEntry(srcRel, ctx);
    else await installManaged(srcRel, join('.claude', srcRel), ctx);
  }

  endInstall(ctx, [
    'CLAUDE.md 하단에 프로젝트별 규칙을 추가하세요.',
    `컨벤션 수정은 ${CONVENTIONS_FILE} 에서.`,
  ]);
}

/**
 * CLAUDE.md: 사용자 소유 파일이라 절대 덮어쓰지 않는다.
 * CLAUDE.template.md 원본이 대상 repo 루트에 CLAUDE.md로 놓인다.
 * - 없으면 → 템플릿으로 새로 생성
 * - 있고 이미 conventions.md를 참조 → 그대로 둠
 * - 있고 참조 없음 → 기존 내용 유지한 채 참조 한 줄만 추가할지 물어봄
 */
async function installClaudeEntry(srcRel, ctx) {
  const from = join(ctx.srcDir, srcRel);
  const to = join(ctx.targetRoot, CLAUDE_FILE);
  const shown = relative(ctx.targetRoot, to).split('\\').join('/');

  if (!existsSync(to)) {
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    log.ok(`생성   ${shown}`);
    ctx.written++;
    return;
  }

  const current = readFileSync(to, 'utf8');
  if (current.includes(CONVENTIONS_FILE)) {
    log.skip(`이미 ${CONVENTIONS_FILE} 참조함  ${shown}`);
    ctx.skipped++;
    return;
  }

  log.warn(`${c.bold(shown)} 이(가) 이미 있어요.`);
  const append =
    ctx.assumeYes ||
    (await confirm(
      `기존 내용은 그대로 두고, ${CONVENTIONS_FILE}를 항상 읽도록 참조 한 줄만 추가할까요?`,
      true,
    ));
  if (!append) {
    log.skip(`건너뜀  ${shown} ${c.dim(`(${CONVENTIONS_FILE}만 설치됨)`)}`);
    ctx.skipped++;
    return;
  }

  writeFileSync(to, current.replace(/\s*$/, '') + REFERENCE_BLOCK);
  log.ok(`참조 추가  ${shown}`);
  ctx.written++;
}
