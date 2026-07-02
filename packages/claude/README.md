# @hb-kit/claude

**Claude를 확장하는 각종 하네스 모음.**

Claude를 활용하는 사람에게 필요한 **각종 하네스**를 한곳에 모아둔다. 여러 프로젝트에서 실제로 쓰던 하네스를 범용적인 형태로 다듬어 계속 쌓아나간다.

## 지금 담긴 것

```
CLAUDE.template.md  # 진입점 원본 — claude-init 이 대상 repo 루트에 CLAUDE.md로 설치
rules/              # 코딩 컨벤션 등 세션에 로드되는 규칙 (conventions.md — Next.js App Router · FSD) — claude-init 이 설치
harness-builder/    # 하네스 메타 팩토리 단위 — claude-harness-builder 가 .claude/skills/ 에 설치
```

공용은 `rules/`뿐이다. 나머지는 단위(unit) 폴더로 쌓고, 각자의 `claude-<단위>` 명령으로 설치한다. 단위 폴더는 카테고리(skills/·agents/ …)만 나누면 되고, 설치 시 CLI가 카테고리 뒤에 단위 이름을 끼워 넣는다 (`harness-builder/skills/SKILL.md` → `.claude/skills/harness-builder/SKILL.md`).

> 여러 프로젝트에서 검증된 하네스를 범용화해 계속 더해나간다.
