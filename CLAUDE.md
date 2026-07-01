# hb-kit

내 AI 개발 환경을 세팅하는 키트. `npx`로 다른 repo에 컨벤션/CLAUDE.md를 꽂아 넣는 것을 목표로 한다.

## 구조

```
packages/
├── cli/                # @hb-kit/cli    — 형제 payload를 참조해 설치하는 dispatcher
├── claude/             # @hb-kit/claude — claude-* payload
│   ├── CLAUDE.md       #   배포될 진입점
│   └── rules/conventions.md  # 컨벤션 SSOT (Next.js + FSD)
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

`npx @hb-kit/cli claude-init` 은 `packages/claude` 의 내용을 대상 repo에 꽂는다.

- `packages/claude` 밑 내용은 대상 repo의 `.claude/` 로 복사된다 → `rules/conventions.md` → `.claude/rules/conventions.md` (충돌 시 확인). `.claude/rules/`는 Claude Code가 세션 시작 시 자동 로드한다.
- `CLAUDE.md` 만 예외로 repo 루트에 놓인다. 기존 파일은 **덮어쓰지 않고**, 컨벤션 참조 한 줄(사람용 안내)만 추가할지 물어본다. 없으면 새로 생성.

cli는 `packages/claude`를 상대경로로 참조한다(`packages/cli/src` → `../../claude`). `npx @hb-kit/cli` 단독 설치본을 위해선 publish 시점(`prepack`)에만 payload를 CLI 패키지 안으로 번들한다(gitignore된 빌드 산출물, 소스는 `packages/claude`가 소유).

## 컨벤션

이 repo에서 Next.js 코드를 작성할 때도 동일한 컨벤션을 따른다.

→ [`packages/claude/rules/conventions.md`](packages/claude/rules/conventions.md)

`packages/claude/rules/conventions.md`가 컨벤션의 **단일 진실 공급원**이다. 컨벤션을 바꿀 일이 생기면 이 파일을 수정한다 (배포본이 곧 이 파일이다).
