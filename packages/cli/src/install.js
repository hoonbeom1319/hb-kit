import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { c, confirm, log } from './util.js';

/**
 * 설치 명령 공통 골격. 각 커맨드 파일(claude-init.js, claude-harness-builder.js …)이
 * beginInstall → installManaged 반복 → endInstall 순으로 쓴다.
 */

/** 대상 경로·플래그 해석 + 헤더 출력. 이후 install 헬퍼들이 쓰는 ctx를 만든다. */
export function beginInstall(command, flags, srcDir) {
  const targetRoot = resolve(process.cwd(), flags.dir === true ? '.' : flags.dir ?? '.');
  const ctx = {
    srcDir,
    targetRoot,
    force: Boolean(flags.force || flags.f),
    assumeYes: Boolean(flags.yes || flags.y),
    written: 0,
    skipped: 0,
  };

  log.info('');
  log.info(c.bold(`hb-kit ${command}`));
  log.info(c.dim(`대상: ${targetRoot}`));
  log.info('');

  return ctx;
}

/** hb-kit가 관리하는 파일: 충돌 시 물어보고 덮어쓴다. */
export async function installManaged(srcRel, targetRel, ctx) {
  const from = join(ctx.srcDir, srcRel);
  const to = join(ctx.targetRoot, targetRel);
  const shown = relative(ctx.targetRoot, to).split('\\').join('/');

  if (existsSync(to) && !ctx.force) {
    const overwrite =
      ctx.assumeYes ||
      (await confirm(`${c.bold(shown)} 이(가) 이미 있어요. 최신 내용으로 덮어쓸까요?`, true));
    if (!overwrite) {
      log.skip(`건너뜀  ${shown}`);
      ctx.skipped++;
      return;
    }
  }

  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  log.ok(`생성   ${shown}`);
  ctx.written++;
}

/** 적용/건너뜀 요약 + 다음 단계 안내 출력. */
export function endInstall(ctx, nextSteps = []) {
  log.info('');
  log.info(
    `${c.green(`${ctx.written}개 적용`)}${ctx.skipped ? c.dim(`, ${ctx.skipped}개 건너뜀`) : ''}`,
  );
  if (nextSteps.length) {
    log.info('');
    log.info(c.bold('다음 단계'));
    nextSteps.forEach((step, i) => log.info(`  ${c.dim(`${i + 1}.`)} ${step}`));
  }
  log.info('');
}
