import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { claudeHarnessBuilder } from './claude-harness-builder.js';
import { claudeInit } from './claude-init.js';
import { c, parseFlags } from './util.js';

const pkg = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'),
);

const HELP = `
${c.bold('hb-kit')} ${c.dim(`v${pkg.version}`)} — AI 개발 컨벤션 스캐폴더

${c.bold('사용법')}
  npx @hb-kit/cli <command> [options]

${c.bold('명령어')}
  claude-init                CLAUDE.md + .claude/rules/conventions.md 를 현재 프로젝트에 설치
  claude-harness-builder     하네스 메타 팩토리(스킬)를 .claude/skills/ 에 설치

${c.bold('옵션')}
  --dir <path>    대상 디렉토리 (기본: 현재 위치)
  -f, --force     기존 파일을 묻지 않고 덮어쓰기
  -y, --yes       모든 질문에 yes
  -h, --help      도움말
  -v, --version   버전

${c.bold('예시')}
  npx @hb-kit/cli claude-init
  npx @hb-kit/cli claude-init --dir ./apps/web --yes
  npx @hb-kit/cli claude-harness-builder
`;

export async function run(argv) {
  const { flags, positional } = parseFlags(argv);
  const command = positional[0];

  if (flags.v || flags.version) {
    console.log(pkg.version);
    return;
  }
  if (!command || flags.h || flags.help) {
    console.log(HELP);
    return;
  }

  switch (command) {
    case 'claude-init':
      await claudeInit({ flags, positional: positional.slice(1) });
      break;
    case 'claude-harness-builder':
      await claudeHarnessBuilder({ flags, positional: positional.slice(1) });
      break;
    default:
      console.error(`${c.red('알 수 없는 명령어:')} ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}
