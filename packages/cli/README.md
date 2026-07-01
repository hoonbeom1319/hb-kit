# @hb-kit/cli

AI 개발 컨벤션(`CLAUDE.md` + `.claude/rules/conventions.md`)을 프로젝트에 꽂아주는 CLI.

## 사용

```bash
npx @hb-kit/cli claude-init
```

> `init` 은 `claude-init` 의 하위 호환 alias로 계속 동작한다.

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

컨벤션 원본은 repo 루트 `templates/claude/` 에 있다(SSOT). 배포 시
`prepack`이 이를 패키지 안으로 동기화한다. CLI는 설치본/모노레포 양쪽
경로를 모두 탐색하므로 개발 중에도 그대로 동작한다.
