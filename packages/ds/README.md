# @hb-kit/ds

Radix UI + Tailwind CSS v4 기반 React 디자인 시스템.

## 토큰

```ts
import '@hb-kit/ds/tokens/default.css';
```

- **Primary**: tangerine (Tailwind `orange` ramp)
- **Font**: Pretendard (`src/fonts/*.woff2` → `font.css` `@font-face`, 기본 스택은 `theme.css`의 `--font-sans`)

앱에서 폰트 스택만 바꾸려면 `@theme`에서 `--font-sans`를 덮어쓰면 됩니다. Pretendard 파일 로드는 `default.css` import가 필요합니다.

## 스크립트

```bash
pnpm --filter @hb-kit/ds storybook   # port 6006
pnpm --filter @hb-kit/ds typecheck
pnpm --filter @hb-kit/ds test
pnpm --filter @hb-kit/ds build
```

## Claude Design 핸드오프

`claude.ai/design`에서보낸 번들은 `.design-handoff/`에 두고, `packages/ds`는 primitives + category 2계층 구조를 유지한 채 토큰·스타일만 이식합니다.
