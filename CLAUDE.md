# hb-kit

내 AI 개발 환경을 세팅하는 키트. `npx`로 다른 repo에 컨벤션/CLAUDE.md를 꽂아 넣는 것을 목표로 한다.

## 구조

```
templates/claude/                    # 다른 repo로 배포될 원본 (SSOT)
├── CLAUDE.md                        # 배포될 진입점
└── .claude/rules/conventions.md     # 컨벤션 SSOT (Next.js + FSD) — 대상 repo에서 자동 로드됨

packages/
├── cli/               # `npx @hb-kit/cli claude-init` — 컨벤션 설치 CLI
├── ds/                # 디자인시스템 (당분간 유지)
├── hooks/
└── utils/
```

## 설치 CLI

`npx @hb-kit/cli claude-init` 은 `templates/claude/` 를 대상 repo에 꽂는다.

- `.claude/rules/conventions.md` → 복사 (충돌 시 확인). `.claude/rules/`는 Claude Code가 세션 시작 시 자동 로드한다.
- `CLAUDE.md` → 기존 파일은 **덮어쓰지 않고**, 컨벤션 참조 한 줄(사람용 안내)만 추가할지 물어본다. 없으면 새로 생성.

`init` 은 `claude-init` 의 하위 호환 alias로 계속 동작한다.

CLI 코드는 `packages/cli/`. 컨벤션 원본은 루트 `templates/` 이며, 배포 시 `prepack`이 패키지 안으로 동기화한다.

## 컨벤션

이 repo에서 Next.js 코드를 작성할 때도 동일한 컨벤션을 따른다.

→ [`templates/claude/.claude/rules/conventions.md`](templates/claude/.claude/rules/conventions.md)

`templates/claude/.claude/rules/conventions.md`가 컨벤션의 **단일 진실 공급원**이다. 컨벤션을 바꿀 일이 생기면 이 파일을 수정한다 (루트/배포본은 이 파일을 참조).
