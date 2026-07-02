<div align="center">

# 🧰 hb-kit

**내 AI 개발 환경을 이루는 빌딩 블록 모음**

AI 컨벤션 스캐폴더와 Claude 하네스부터 디자인 시스템까지 — 프로젝트를 빠르게 시작하기 위한 패키지들을 한 모노레포에 담았습니다.

<br/>

[![npm version](https://img.shields.io/npm/v/@hb-kit/cli?color=CB3837&logo=npm&label=%40hb-kit%2Fcli)](https://www.npmjs.com/package/@hb-kit/cli)
[![node](https://img.shields.io/node/v/@hb-kit/cli?color=339933&logo=node.js&logoColor=white)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@hb-kit/cli?color=blue)](./LICENSE)

</div>

<br/>

## 📦 패키지

각 패키지의 자세한 사용법은 패키지 안의 README를 참고하세요.

| 패키지 | 설명 | 버전 |
| --- | --- | --- |
| [**@hb-kit/cli**](packages/cli#readme) | AI 컨벤션(`CLAUDE.md` + `.claude/rules`)과 Claude 하네스(스킬)를 프로젝트에 꽂아주는 CLI | [![npm](https://img.shields.io/npm/v/@hb-kit/cli?color=CB3837&label=npm)](https://www.npmjs.com/package/@hb-kit/cli) |
| [**@hb-kit/claude**](packages/claude#readme) | Claude를 확장하는 하네스 모음 (컨벤션 SSOT · [harness-builder](packages/claude/harness-builder#readme) …) — cli가 참조하는 payload | 비공개 |
| [**@hb-kit/ds**](packages/ds#readme) | Radix UI + Tailwind CSS v4 기반 React 디자인 시스템 | [![npm](https://img.shields.io/npm/v/@hb-kit/ds?color=CB3837&label=npm)](https://www.npmjs.com/package/@hb-kit/ds) |
| **@hb-kit/hooks** | 도메인 무관 범용 React hook 모음 | 🚧 예정 |
| **@hb-kit/utils** | 프레임워크 비의존 순수 유틸 | 🚧 예정 |

<br/>

## ⚡ 빠른 시작

```bash
# 현재 프로젝트에 AI 컨벤션(CLAUDE.md + .claude/rules) 설치
npx @hb-kit/cli claude-init

# 하네스 메타 팩토리(harness-builder 스킬) 설치
npx @hb-kit/cli claude-harness-builder
```

> `claude-init`은 `.claude/rules/conventions.md`(Next.js · FSD · 서버 레이어링 컨벤션 — Claude Code가 세션 시작 시 자동 로드)와 `CLAUDE.md`를 꽂고, `claude-harness-builder`는 임의 도메인의 하네스를 인터뷰로 설계·생성하는 스킬을 꽂습니다. 자세한 옵션·동작은 → [`@hb-kit/cli` README](packages/cli#readme)

<br/>

## 🗂 저장소 구조

```
packages/
├── cli/     # @hb-kit/cli — 형제 payload를 참조해 설치하는 dispatcher     → packages/cli/README.md
├── claude/  # claude-* payload (컨벤션 SSOT + harness-builder) — 비공개, 배포 안 함 → packages/claude/README.md
├── ds/      # @hb-kit/ds  — 디자인 시스템                                 → packages/ds/README.md
├── hooks/   # (예정)
└── utils/   # (예정)
```

명령어는 `<prefix>-<command>` 규칙을 따르고(`claude-init`, 향후 `ds-*`·`hooks-*`), prefix마다 payload 폴더가 하나씩 있습니다(`packages/claude`, 향후 `packages/hooks` …). 이 payload 폴더들은 **npm에 배포하지 않고**, `@hb-kit/cli`가 **상대경로로 참조**만 합니다. `claude-*` 명령 실행 시 `packages/claude`의 내용을 대상 repo에 꽂습니다. 컨벤션 원본(SSOT)은 `packages/claude/rules/conventions.md`이며, `npx @hb-kit/cli` 단독 설치를 위해 publish 시점에만 payload를 CLI 패키지 안으로 번들합니다.

<br/>

## 🛠 로컬 개발

pnpm 워크스페이스 + Node 22+ 기반입니다.

```bash
pnpm install       # 의존성 설치
pnpm build         # 전체 패키지 빌드
pnpm lint          # 린트
pnpm typecheck     # 타입 체크
pnpm test          # 테스트
pnpm ds:storybook  # 디자인 시스템 Storybook (→ http://localhost:6006)
pnpm release       # 빌드 후 전체 패키지 publish
```

<br/>

## 📄 라이선스

[MIT](./LICENSE)

<div align="center">
<br/>
<sub>Made with ☕ for AI-native development</sub>
</div>
