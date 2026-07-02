# hb-kit

내 AI 개발 환경을 세팅하는 키트. `npx`로 다른 repo에 컨벤션/CLAUDE.md를 꽂아 넣는 것을 목표로 한다.

## 구조

```
packages/
├── cli/                # @hb-kit/cli    — 형제 payload를 참조해 설치하는 dispatcher
├── claude/             # @hb-kit/claude — claude-* payload
│   ├── CLAUDE.template.md    # 배포될 진입점 원본 (claude-init이 대상 루트에 CLAUDE.md로 설치)
│   ├── rules/conventions.md  # 컨벤션 SSOT (Next.js + FSD) — 유일한 공용 payload
│   └── harness-builder/      # 단위(unit) — 하네스 메타 팩토리 (claude-harness-builder)
│       └── skills/           #   → 대상 repo .claude/skills/harness-builder/
├── ds/                 # @hb-kit/ds     — 디자인시스템
├── hooks/              # (예정)
└── utils/              # (예정)
```

## 명령어 · payload 규칙

- 명령어는 `<prefix>-<command>` 형태로 간다 (`claude-init`, 향후 `ds-*`·`hooks-*`).
- prefix마다 payload 폴더가 하나씩 있다 (`packages/claude`, 향후 `packages/hooks` …). `claude`도 `ds`·`hooks`와 **나란한 형제**다 — cli 안에 넣지 않는다.
- payload 폴더는 **npm 배포 안 한다**(`packages/claude`는 `private`). `@hb-kit/cli`가 **상대경로로 참조**만 한다.
- **`cli`는 dispatcher일 뿐**이다. 형제 payload를 참조해 설치·기타 작업을 수행한다. payload 원본은 각 폴더가 소유한다.

## 설치 CLI

`packages/claude`에서 **공용은 `rules/`뿐**이고, 나머지는 전부 **단위(unit) 폴더**로 만든다. 단위마다 설치 명령이 하나씩 붙는다.

- `npx @hb-kit/cli claude-init` — 공용 컨벤션만 설치한다.
  - `rules/conventions.md` → 대상 repo `.claude/rules/conventions.md` (충돌 시 확인). `.claude/rules/`는 Claude Code가 세션 시작 시 자동 로드한다.
  - `CLAUDE.template.md` 만 예외로 대상 repo 루트에 `CLAUDE.md`로 놓인다. 기존 파일은 **덮어쓰지 않고**, 컨벤션 참조 한 줄(사람용 안내)만 추가할지 물어본다. 없으면 새로 생성. (원본을 `.template`로 두는 이유: `packages/claude`는 Next.js 프로젝트가 아니라서, `CLAUDE.md` 그대로면 그 폴더 작업 시 엉뚱한 컨벤션이 자동 로드된다.)
- `npx @hb-kit/cli claude-harness-builder` — harness-builder 단위를 설치한다.
  - 단위 폴더는 카테고리(skills/·agents/ …)만 나누고 자기 이름을 반복하지 않는다. 설치 시 CLI가 카테고리 뒤에 단위 이름을 끼워 넣는다: `harness-builder/skills/SKILL.md` → `.claude/skills/harness-builder/SKILL.md`, (있다면) `harness-builder/agents/*` → `.claude/agents/harness-builder/*`.
  - 향후 단위도 같은 패턴으로 추가한다 (단위 폴더 + `claude-<단위>` 명령).

cli는 `packages/claude`를 상대경로로 참조한다(`packages/cli/src` → `../../claude`). `npx @hb-kit/cli` 단독 설치본을 위해선 publish 시점(`prepack`)에만 payload를 CLI 패키지 안으로 번들한다(gitignore된 빌드 산출물, 소스는 `packages/claude`가 소유).

## 컨벤션

이 repo에서 Next.js 코드를 작성할 때도 동일한 컨벤션을 따른다.

→ [`packages/claude/rules/conventions.md`](packages/claude/rules/conventions.md)

`packages/claude/rules/conventions.md`가 컨벤션의 **단일 진실 공급원**이다. 컨벤션을 바꿀 일이 생기면 이 파일을 수정한다 (배포본이 곧 이 파일이다).
