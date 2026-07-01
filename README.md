<div align="center">

# 🧰 hb-kit

**AI 개발 환경을 한 줄로 세팅하는 키트**

`npx` 한 번이면 어떤 repo든 — Claude가 세션 시작부터 읽는 컨벤션과 `CLAUDE.md`가 꽂힙니다.

<br/>

[![npm version](https://img.shields.io/npm/v/@hb-kit/cli?color=CB3837&logo=npm&label=%40hb-kit%2Fcli)](https://www.npmjs.com/package/@hb-kit/cli)
[![npm downloads](https://img.shields.io/npm/dw/@hb-kit/cli?color=CB3837&logo=npm&label=downloads)](https://www.npmjs.com/package/@hb-kit/cli)
[![GitHub stars](https://img.shields.io/github/stars/hoonbeom1319/hb-kit?color=yellow&logo=github)](https://github.com/hoonbeom1319/hb-kit/stargazers)
[![node](https://img.shields.io/node/v/@hb-kit/cli?color=339933&logo=node.js&logoColor=white)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@hb-kit/cli?color=blue)](./LICENSE)

</div>

<br/>

## ✨ 왜?

AI 코딩 도구는 **컨벤션을 알려줘야** 제대로 짭니다. 하지만 repo마다 `CLAUDE.md`를 복붙하고, 규칙이 바뀔 때마다 여러 곳을 손보는 건 금방 어긋납니다.

`hb-kit`은 컨벤션을 **하나의 SSOT**로 두고, 명령 한 번으로 어떤 프로젝트에든 배포합니다.

```bash
npx @hb-kit/cli claude-init
```

이 한 줄이 현재 디렉토리에 다음을 꽂습니다:

```
CLAUDE.md                       # AI 진입점 (사람용 컨벤션 pointer)
.claude/rules/conventions.md    # Next.js + FSD 컨벤션 — 세션 시작 시 자동 로드
```

> 💡 `.claude/rules/` 안의 파일은 **Claude Code가 세션 시작 시 자동으로 읽습니다.** 매번 "우리 컨벤션은…" 하고 붙여넣을 필요가 없어요.

<br/>

## 🚀 사용

```bash
# 현재 디렉토리에 설치
npx @hb-kit/cli claude-init

# 특정 앱에 설치하고 모든 질문에 yes
npx @hb-kit/cli claude-init --dir ./apps/web --yes
```

### 설치 시 동작

| 파일 | 동작 |
| --- | --- |
| `.claude/rules/conventions.md` | 복사합니다. 이미 있으면 **덮어쓸지 물어봅니다.** |
| `CLAUDE.md` (없을 때) | 템플릿으로 새로 생성합니다. |
| `CLAUDE.md` (있을 때) | **절대 덮어쓰지 않습니다.** 기존 내용은 그대로 두고, 컨벤션을 가리키는 참조 한 줄만 추가할지 물어봅니다. |

여러분이 이미 써 둔 `CLAUDE.md`는 안전합니다 — hb-kit은 사용자 소유 파일을 건드리지 않아요.

### 옵션

| 옵션 | 설명 |
| --- | --- |
| `--dir <path>` | 대상 디렉토리 (기본: 현재 위치) |
| `-f, --force` | 기존 `conventions.md`를 묻지 않고 덮어쓰기 |
| `-y, --yes` | 모든 질문에 yes |
| `-h, --help` | 도움말 |
| `-v, --version` | 버전 |

> `init` 은 `claude-init` 의 하위 호환 alias로 계속 동작합니다.

<br/>

## 📐 담긴 컨벤션

배포되는 컨벤션은 **Next.js (App Router) + FSD** 기반입니다. 핵심만 추리면:

- **레이어 단방향 의존** — `application → screens → widgets → features → entities → shared`
- **Public API import** — 슬라이스는 루트 `index.ts`로만. 내부 파일 직접 import 금지
- **파일명은 항상 `kebab-case`** — export 식별자만 PascalCase/camelCase
- **RSC 우선** — `'use client'`는 상호작용이 필요한 잎(leaf)에만
- **상태 분리** — 서버 데이터·캐시는 TanStack Query, 클라이언트 UI 상태는 Zustand
- **서버 접근은 controller만** — 컴포넌트에서 dao 직접 import 금지

> 전체 규칙은 [`templates/claude/.claude/rules/conventions.md`](templates/claude/.claude/rules/conventions.md) — 이 파일이 컨벤션의 **단일 진실 공급원(SSOT)**입니다.

<br/>

## 🗂 저장소 구조

```
templates/claude/                    # 배포될 원본 (SSOT)
├── CLAUDE.md                        # 배포될 진입점
└── .claude/rules/conventions.md     # 컨벤션 본문 — 대상 repo에서 자동 로드됨

packages/
├── cli/    # @hb-kit/cli — claude-init 설치 CLI
├── ds/     # 디자인시스템
├── hooks/
└── utils/
```

컨벤션 원본은 루트 `templates/`에 두고, 배포 시 `prepack`이 CLI 패키지 안으로 동기화합니다. CLI는 설치본·모노레포 양쪽 경로를 모두 탐색하므로 개발 중에도 그대로 동작합니다.

<br/>

## 🛠 로컬 개발

```bash
pnpm install       # 의존성 설치 (pnpm + Node 22+)
pnpm build         # 전체 패키지 빌드
pnpm lint          # 린트
pnpm test          # 테스트

# CLI를 로컬에서 실행
node packages/cli/bin/hb-kit.js claude-init --dir /tmp/demo
```

컨벤션을 바꾸려면 **`templates/claude/.claude/rules/conventions.md` 하나만** 수정하면 됩니다. 루트·배포본은 이 파일을 참조합니다.

<br/>

## 📄 라이선스

[MIT](./LICENSE)

<div align="center">
<br/>
<sub>Made with ☕ for AI-native development</sub>
</div>
