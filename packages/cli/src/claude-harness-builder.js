import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { beginInstall, endInstall, installManaged } from './install.js';
import { c, listFiles, resolvePayloadDir } from './util.js';

const UNIT = 'harness-builder';

/**
 * `hb-kit claude-harness-builder` — harness-builder 단위(unit)를 대상 repo에 설치.
 *
 * 단위 폴더는 카테고리(skills/, agents/ …)만 나누고 자기 이름을 반복하지 않는다.
 * 설치 시 카테고리 뒤에 단위 이름을 끼워 넣는다:
 *   harness-builder/skills/SKILL.md → .claude/skills/harness-builder/SKILL.md
 *   harness-builder/agents/{역할}.md → .claude/agents/harness-builder/{역할}.md
 */
export async function claudeHarnessBuilder({ flags }) {
  const srcDir = join(resolvePayloadDir('claude'), UNIT);
  if (!existsSync(srcDir)) {
    throw new Error(`${UNIT} payload를 찾을 수 없습니다. packages/claude/${UNIT} 가 있는지 확인하세요.`);
  }

  const ctx = beginInstall(`claude-${UNIT}`, flags, srcDir);

  for (const srcRel of listFiles(srcDir)) {
    const [category, ...rest] = srcRel.split('/');
    await installManaged(srcRel, join('.claude', category, UNIT, ...rest), ctx);
  }

  endInstall(ctx, [
    `Claude Code에서 ${c.bold('/harness-builder')} 로 호출하거나 "{X} 하네스 만들어줘"라고 요청하세요.`,
  ]);
}
