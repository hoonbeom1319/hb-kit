---
name: design-system-evaluation
description: >-
  Pointer to the universal design-system-evaluation skill. Prefer the personal
  skill at ~/.cursor/skills/design-system-evaluation for repo-agnostic DS audits.
---

# 디자인 시스템 평가

이 프로젝트에는 **범용 스킬**의 사본이 아닌 안내만 둡니다.

평가 실행 시 **`design-system-evaluation` 개인 스킬** (`~/.cursor/skills/design-system-evaluation/SKILL.md`)을 따르세요.

- 레포·패키지 경로 자동 탐색
- 캡처: 레포에 스크립트 복사 없음. `DS_ROOT=... node ~/.cursor/skills/.../scripts/capture-storybook-screenshots.mjs` 또는 에이전트 직접 Playwright
- 산출물만: `{ds-root}/design-evaluation/report.html`
