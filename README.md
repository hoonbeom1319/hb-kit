<div align="center">

# 🧰 hb-kit

**내 AI 개발 환경을 이루는 빌딩 블록 모음**

컨벤션 스캐폴더부터 디자인 시스템까지 — 프로젝트를 빠르게 시작하기 위한 패키지들을 한 모노레포에 담았습니다.

<br/>

[![npm version](https://img.shields.io/npm/v/@hb-kit/cli?color=CB3837&logo=npm&label=%40hb-kit%2Fcli)](https://www.npmjs.com/package/@hb-kit/cli)
[![npm downloads](https://img.shields.io/npm/dw/@hb-kit/cli?color=CB3837&logo=npm&label=downloads)](https://www.npmjs.com/package/@hb-kit/cli)
[![GitHub stars](https://img.shields.io/github/stars/hoonbeom1319/hb-kit?color=yellow&logo=github)](https://github.com/hoonbeom1319/hb-kit/stargazers)
[![node](https://img.shields.io/node/v/@hb-kit/cli?color=339933&logo=node.js&logoColor=white)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@hb-kit/cli?color=blue)](./LICENSE)

</div>

<br/>

## 📦 패키지

각 패키지의 자세한 사용법은 패키지 안의 README를 참고하세요.

| 패키지 | 설명 | 버전 |
| --- | --- | --- |
| [**@hb-kit/cli**](packages/cli#readme) | AI 개발 컨벤션(`CLAUDE.md` + `.claude/rules`)을 프로젝트에 꽂는 스캐폴더 | [![npm](https://img.shields.io/npm/v/@hb-kit/cli?color=CB3837&label=npm)](https://www.npmjs.com/package/@hb-kit/cli) |
| [**@hb-kit/ds**](packages/ds#readme) | Radix UI + Tailwind CSS v4 기반 React 디자인 시스템 | [![npm](https://img.shields.io/npm/v/@hb-kit/ds?color=CB3837&label=npm)](https://www.npmjs.com/package/@hb-kit/ds) |
| **@hb-kit/hooks** | 도메인 무관 범용 React hook 모음 | 🚧 예정 |
| **@hb-kit/utils** | 프레임워크 비의존 순수 유틸 | 🚧 예정 |

<br/>

## ⚡ 빠른 시작

```bash
# 현재 프로젝트에 AI 컨벤션(CLAUDE.md + .claude/rules) 설치
npx @hb-kit/cli claude-init
```

> 이 한 줄이 `.claude/rules/conventions.md`(Next.js · FSD · 서버 레이어링 컨벤션 — Claude Code가 세션 시작 시 자동 로드)와 `CLAUDE.md`를 꽂습니다. 자세한 옵션·동작은 → [`@hb-kit/cli` README](packages/cli#readme)

<br/>

## 🗂 저장소 구조

```
templates/claude/                    # 컨벤션 원본 (SSOT) — @hb-kit/cli가 배포
├── CLAUDE.md
└── .claude/rules/conventions.md

packages/
├── cli/     # @hb-kit/cli — 컨벤션 스캐폴더        → packages/cli/README.md
├── ds/      # @hb-kit/ds  — 디자인 시스템          → packages/ds/README.md
├── hooks/   # (예정)
└── utils/   # (예정)
```

컨벤션 원본은 루트 `templates/`에 두고(SSOT), 배포 시 `prepack`이 CLI 패키지 안으로 동기화합니다.

<br/>

## 🛠 로컬 개발

pnpm 워크스페이스 + Node 22+ 기반입니다.

```bash
pnpm install       # 의존성 설치
pnpm build         # 전체 패키지 빌드
pnpm lint          # 린트
pnpm test          # 테스트
pnpm ds:storybook  # 디자인 시스템 Storybook (→ http://localhost:6006)
```

<br/>

## 📄 라이선스

[MIT](./LICENSE)

<div align="center">
<br/>
<sub>Made with ☕ for AI-native development</sub>
</div>
