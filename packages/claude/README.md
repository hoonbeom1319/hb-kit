# @hb-kit/claude

`claude-*` 명령이 대상 repo에 꽂는 **AI 컨벤션 payload**다. **npm에 배포하지 않는다**(private).

```
CLAUDE.md              # 대상 repo 루트 진입점 (없으면 생성, 있으면 참조 한 줄만 추가)
rules/conventions.md   # 대상 repo .claude/rules/conventions.md 로 설치 (Next.js · FSD SSOT)
```

직접 쓰기보단 `@hb-kit/cli`를 통해 설치한다:

```bash
npx @hb-kit/cli claude-init
```

`@hb-kit/cli`가 이 폴더를 **상대경로로 참조**해, 밑 내용을 대상 repo의 `.claude/`로 복사한다
(`CLAUDE.md`만 예외로 repo 루트에 놓인다). 컨벤션 원본(SSOT)이 곧 `rules/conventions.md`다.
