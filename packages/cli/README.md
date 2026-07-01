# @hb-kit/cli

AI 개발 컨벤션(`CLAUDE.md` + `.claude/rules/conventions.md`)을 프로젝트에 꽂아주는 CLI.

## 사용

```bash
npx @hb-kit/cli claude-init
```

현재 디렉토리에 다음을 생성한다:

```
CLAUDE.md                       # AI 진입점 (사람용 컨벤션 pointer)
.claude/rules/conventions.md    # Next.js · FSD · 서버 레이어링 컨벤션 SSOT — 세션 시작 시 자동 로드
```

## 옵션

| 옵션 | 설명 |
| --- | --- |
| `--dir <path>` | 대상 디렉토리 (기본: 현재 위치) |
| `-f, --force` | 기존 파일을 묻지 않고 덮어쓰기 |
| `-y, --yes` | 모든 질문에 yes |
| `-h, --help` | 도움말 |
| `-v, --version` | 버전 |

## 동작 방식

`@hb-kit/cli`는 **dispatcher**다. 배포할 payload는 자기 안이 아니라 **형제 폴더**(`packages/<prefix>`)가
소유하고, cli는 그걸 **상대경로로 참조**만 한다. payload 폴더는 npm에 배포하지 않는다.

- `claude-init` → `packages/claude` (`CLAUDE.md` + `rules/conventions.md`)
- (예정) `ds-*` → `packages/ds`, `hooks-*` → `packages/hooks`

`packages/claude` 밑 내용은 대상 repo의 `.claude/` 로 복사된다(`CLAUDE.md`만 예외로 repo 루트).

모노레포 개발에선 `packages/claude`를 상대경로로 바로 읽는다. `npx @hb-kit/cli` 단독
설치본을 위해선 publish 시점(`prepack`)에만 payload를 패키지 안으로 번들한다 — gitignore된
빌드 산출물이며, 원본(SSOT)은 `packages/claude`가 소유한다.

명령어는 `<prefix>-<command>` 규칙을 따른다.
