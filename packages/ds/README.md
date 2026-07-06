# @hb-kit/ds

[Radix UI](https://www.radix-ui.com/) + [Tailwind CSS v4](https://tailwindcss.com/) 기반 React 19 디자인 시스템.

접근성과 동작은 헤드리스 레이어에 맡기고, 그 위에 토큰 기반 스타일만 입혀 룩앤필을 통일합니다.

## 설치

```bash
pnpm add @hb-kit/ds
```

```ts
import '@hb-kit/ds/tokens/default.css'; // 토큰 + Pretendard 폰트 (앱 진입점에서 1회)

import { Button } from '@hb-kit/ds/display';
import { Input, Checkbox } from '@hb-kit/ds/forms';
import { Toast } from '@hb-kit/ds/feedback';
```

> `peerDependencies`로 `react`/`react-dom` `>=19` 이 필요합니다.

## 아키텍처 — 2계층

컴포넌트를 **접근성/동작**과 **스타일** 두 층으로 분리합니다.

```
primitives/                     # 1층 · 헤드리스 — 접근성 + 동작만, 스타일 0
   │                            #   role·aria-*·키보드 상호작용을 책임진다
   │                            #   (Radix UI 래핑 또는 시맨틱 HTML)
   ▼  소비
display · forms · feedback ·    # 2층 · 카테고리 — 1층 위에 Tailwind 토큰으로
navigation · overlay ·          #   스타일을 입힌 '실제로 쓰는' 컴포넌트
surfaces · layout
```

- **1층 `primitives/`** 는 접근성의 원천입니다. 예) `primitives/breadcrumb`는 `<nav aria-label="breadcrumb">`·`role="presentation"` 구분자 같은 시맨틱만, `primitives/dialog`는 Radix 위에 포커스 트랩·`aria-modal`을 얹습니다. **스타일은 없습니다.**
- **2층 카테고리** 는 이 접근성 기반을 소비해 색·간격·아이콘을 입힙니다.

```tsx
// display/button.tsx — 2층이 1층을 감싸 스타일만 얹는 예
import * as ButtonPrimitive from '../primitives/button';
import { cn } from '../lib/utils';

// primary·secondary·outline·ghost·danger × sm·md·lg 를 Tailwind로 부여,
// 버튼의 동작·포커스 링 등 접근성은 ButtonPrimitive 그대로 상속
```

접근성의 원천은 **Radix UI**입니다. 대부분은 로컬 `primitives/` 레이어를 경유하고, 폼 컨트롤(`select`·`checkbox`·`switch` 등)은 Radix를 직접 감쌉니다. 순수 표시용(`Badge`·`Input`·`Card` 등)은 별도 primitive 없이 시맨틱 HTML + Tailwind로만 구성합니다.

## 카테고리별 컴포넌트

카테고리마다 별도 서브패스로 노출되어 **필요한 것만 import**할 수 있습니다.

| import | 컴포넌트 |
| --- | --- |
| `@hb-kit/ds/display` | Button · Badge · Avatar · Carousel · Table · Timeline · Typography |
| `@hb-kit/ds/forms` | Input · Textarea · Checkbox · RadioGroup · Select · Switch · Slider · Toggle · ToggleGroup · Label · Field |
| `@hb-kit/ds/feedback` | Alert · Toast · Progress · Spinner · Skeleton |
| `@hb-kit/ds/overlay` | Dropdown · Popover · Tooltip · Confirm · Slide · BottomSheet |
| `@hb-kit/ds/surfaces` | Card · Accordion · Tabs |
| `@hb-kit/ds/navigation` | Breadcrumb · Pagination |
| `@hb-kit/ds/layout` | Container · Separator |
| `@hb-kit/ds/lib/utils` | `cn()` (clsx + tailwind-merge) |

## 토큰

`tokens/default.css` 하나가 아래 셋을 모두 `@import` 합니다. 개별로 가져올 수도 있습니다.

| 파일 | 내용 |
| --- | --- |
| `@hb-kit/ds/tokens/default.css` | 아래 셋을 합친 진입점 (`body` 기본 폰트 포함) |
| `@hb-kit/ds/tokens/font.css` | Pretendard `@font-face` (`src/fonts/*.woff2`) |
| `@hb-kit/ds/tokens/theme.css` | 색·`--font-sans` 등 테마 변수 |
| `@hb-kit/ds/tokens/motions.css` | 모션/트랜지션 토큰 |

- **Primary**: tangerine (Tailwind `orange` ramp)
- **Font**: Pretendard — 앱에서 폰트 스택만 바꾸려면 `@theme`에서 `--font-sans`를 덮어쓰면 됩니다. (Pretendard 파일 로드는 `default.css` 또는 `font.css` import 필요)

## 스크립트

```bash
pnpm --filter @hb-kit/ds storybook   # 컴포넌트 미리보기 (port 6006)
pnpm --filter @hb-kit/ds typecheck
pnpm --filter @hb-kit/ds test
pnpm --filter @hb-kit/ds build
```
