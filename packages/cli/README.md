# @hb-kit/cli

AI 개발 컨벤션과 Claude 하네스를 프로젝트에 꽂아주는 CLI.

## 사용

### claude-init — 공용 컨벤션 설치

```bash
npx @hb-kit/cli claude-init
```

현재 디렉토리에 다음을 생성한다:

```
CLAUDE.md                       # AI 진입점 (사람용 컨벤션 pointer)
.claude/rules/conventions.md    # Next.js · FSD · 서버 레이어링 컨벤션 SSOT — 세션 시작 시 자동 로드
```

### claude-harness-builder — 하네스 메타 팩토리 설치

```bash
npx @hb-kit/cli claude-harness-builder
```

임의 도메인(개인 생활·여행부터 인사·마케팅·전략·데이터·코드까지)의 하네스를
인터뷰로 설계·생성하는 **메타 팩토리 스킬**을 설치한다:

```
.claude/skills/harness-builder/
├── SKILL.md         # 본체 — 인터뷰 5파도 → G1(청사진) → G2(파일 목록) → 생성 → H0(1회 실행)
├── templates/       # 산출 하네스·에이전트 골격
└── references/      # 도메인별 도구 매핑
```

설치 후 Claude Code에서 `/harness-builder` 로 호출하거나 "{X} 하네스 만들어줘"라고 요청한다.

## 옵션

| 옵션 | 설명 |
| --- | --- |
| `--dir <path>` | 대상 디렉토리 (기본: 현재 위치) |
| `-f, --force` | 기존 파일을 묻지 않고 덮어쓰기 |
| `-y, --yes` | 모든 질문에 yes |
| `-h, --help` | 도움말 |
| `-v, --version` | 버전 |

## 개발

내부 구조(payload 소유권·단위 설치 규칙·prepack 번들)는 [repo 루트 `CLAUDE.md`](https://github.com/hoonbeom1319/hb-kit)를 따른다.
