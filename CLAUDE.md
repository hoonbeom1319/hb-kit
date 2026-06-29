# hb-kit

내 AI 개발 환경을 세팅하는 키트. `npx`로 다른 repo에 컨벤션/CLAUDE.md를 꽂아 넣는 것을 목표로 한다.

## 구조

```
templates/claude/      # 다른 repo로 배포될 원본 (SSOT)
├── CLAUDE.md          # 배포될 진입점
└── conventions.md     # 컨벤션 SSOT (Next.js + FSD)

packages/
├── cli/               # `npx @hb-kit/cli init` — 컨벤션 설치 CLI
├── ds/                # 디자인시스템 (당분간 유지)
├── hooks/
└── utils/
```

## 설치 CLI

`npx @hb-kit/cli init` 은 `templates/claude/` 를 대상 repo에 꽂는다.

- `conventions.md` → 복사 (충돌 시 확인)
- `CLAUDE.md` → 기존 파일은 **덮어쓰지 않고**, `conventions.md` 참조 한 줄만 추가할지 물어본다. 없으면 새로 생성.

CLI 코드는 `packages/cli/`. 컨벤션 원본은 루트 `templates/` 이며, 배포 시 `prepack`이 패키지 안으로 동기화한다.

## 컨벤션

이 repo에서 Next.js 코드를 작성할 때도 동일한 컨벤션을 따른다.

→ [`templates/claude/conventions.md`](templates/claude/conventions.md)

`templates/claude/conventions.md`가 컨벤션의 **단일 진실 공급원**이다. 컨벤션을 바꿀 일이 생기면 이 파일을 수정한다 (루트/배포본은 이 파일을 참조).
