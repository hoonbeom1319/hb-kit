# 개발 컨벤션 (Next.js + FSD)

> 이 문서는 코드 작성·파일 배치의 **단일 진실 공급원(SSOT)**이다.
> 구조/네이밍 판단이 애매할 때는 항상 이 문서를 우선한다.
> 스택: **Next.js (App Router) · TypeScript · Zustand · TanStack Query · Tailwind**

---

## 0. 핵심 원칙 (요약)

1. **레이어는 한 방향으로만 의존한다.** (`app → screens → widgets → features → entities → shared`)
2. **import는 슬라이스 루트(`index.ts`, Public API)로만.** 내부 파일 직접 import 금지.
3. **파일명은 항상 `kebab-case`.** export 식별자만 PascalCase/camelCase.
4. **서버 상태는 TanStack Query, 클라이언트 UI 상태는 Zustand.** 둘을 섞지 않는다.
5. **`app/`은 라우팅 껍데기다.** 화면 로직은 `screens/`에 둔다.
6. **서버 전용 코드는 `server/`에 3계층(dao → controller)으로.** 컴포넌트는 controller만 부른다.

---

## 1. 디렉토리 구조

Next.js App Router와 FSD를 결합한다. `app/`은 **라우팅 전용 레이어**이고, 실제 화면은 FSD의 `screens/`가 담당한다.

```
src/
├── app/                  # Next.js App Router — 라우팅 껍데기 (FSD 최상위 레이어)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (group)/...       # 라우트 그룹
│   └── api/              # BFF route handler (§7)
│
├── screens/              # 페이지 단위 조립 (FSD 'pages' 레이어 — Next 'app'과 충돌 피해 rename)
│   └── {screen}/
│       ├── ui/
│       ├── model/
│       └── index.ts
│
├── widgets/              # 페이지를 구성하는 큰 독립 블록 (header, sidebar, feed ...)
├── features/             # 사용자 액션 단위 (form 제출, toggle, 검색 ...)
├── entities/             # 비즈니스 엔터티의 데이터/표현 (§6 React Query 패턴)
├── shared/               # 도메인 무관 재사용 (ui, hooks, lib, api, config)
│
└── server/               # FSD와 별개. 서버 전용 코드 (§8)
    ├── db/
    ├── dao/
    ├── controllers/
    ├── lib/
    └── types/
```

> **`app/` ↔ `screens/` 관계**: `app/**/page.tsx`는 해당 `screens/{screen}`을 import해서 렌더만 한다. 데이터 패칭·상태·마크업은 `screens/`로 내린다. `app/`에는 `metadata`, `generateStaticParams`, route segment config 같은 **Next.js 라우팅 관심사만** 남긴다.

---

## 2. 파일 · 네이밍 컨벤션

### 2.1 파일/폴더명 — 항상 `kebab-case`

```
user-profile-card.tsx      ✅
use-debounced-value.ts      ✅
UserProfileCard.tsx         ❌
useDebouncedValue.ts        ❌
```

- 컴포넌트 파일도 kebab-case로 두고 **export 식별자만 PascalCase**:
  `user-card.tsx` → `export function UserCard()`
- hook 파일은 `use-` 접두사: `use-auth.ts` → `export function useAuth()`

### 2.2 Next.js App Router 예약 파일 (이건 Next 규칙 그대로)

| 파일 | 역할 |
| --- | --- |
| `page.tsx` | 라우트의 UI 진입점 — `screens/`를 렌더 |
| `layout.tsx` | 공유 레이아웃 (상태 유지) |
| `template.tsx` | 매 네비게이션마다 리마운트되는 레이아웃 |
| `loading.tsx` | Suspense fallback |
| `error.tsx` | 에러 바운더리 (`'use client'` 필수) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API route handler (§7) |

- 라우트 그룹 `(group)`, 동적 세그먼트 `[id]`, catch-all `[...slug]`는 Next 표기 그대로.
- 예약 파일 외 컴포넌트를 라우트 폴더에 두지 않는다 — 화면 코드는 `screens/`로.

### 2.3 슬라이스 내부 표준 파일명

| 파일 | 내용 |
| --- | --- |
| `index.ts` | Public API (외부 노출 정의) |
| `api.ts` | fetch 함수 + 요청/응답 타입 |
| `factory.ts` | `queryOptions` / `mutationOptions` |
| `use-*.ts` | hook |
| `*.store.ts` | Zustand store |
| `types.ts` | 슬라이스 공용 타입 |
| `*.const.ts` / `config.ts` | 상수·설정값 |

### 2.4 식별자 네이밍

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 컴포넌트 | PascalCase | `UserCard` |
| hook | `use` + camelCase | `useUserData` |
| 변수/함수 | camelCase | `fetchUser` |
| 타입/인터페이스 | PascalCase | `UserDto` |
| 상수 | UPPER_SNAKE | `MAX_RETRY` |
| 불리언 | `is/has/should` 접두사 | `isLoading` |

### 2.5 import 경로

- 절대경로 alias `@/*` 사용 (`tsconfig.json`의 `paths`). 상위 디렉토리 상대경로(`../../`) 금지.
- 같은 슬라이스 내부에서만 상대경로 허용.

---

## 3. FSD 레이어 & 의존성 규칙

```
app → screens → widgets → features → entities → shared
```

- **상위 레이어만 하위 레이어를 import.** 역방향 금지.
- **같은 레이어 내 슬라이스 간 import 금지.**
  예) `features/auth`가 `features/profile`을 직접 import ❌ → 공통 부분을 `entities`/`shared`로 내린다.
- **import는 항상 슬라이스 루트 `index.ts`(Public API)로만.** `features/auth/model/store.ts` 직접 import ❌.
- `entities`/`shared`는 상위 레이어를 모른다. 필요한 값은 **파라미터로 주입**받는다.

### 새 기능 추가 절차

1. 어느 레이어인지 먼저 판단한다.
   - 비즈니스 엔터티의 데이터/표현 → `entities`
   - 사용자 액션(폼 제출, 토글) → `features`
   - 페이지의 큰 독립 블록 → `widgets`
   - 페이지 조립 → `screens`
   - 도메인 무관 재사용 → `shared`
2. 슬라이스 폴더를 만들고 필요한 세그먼트만 채운다.
3. `index.ts`에 외부 노출 API를 정의한다.
4. 사용처는 슬라이스 루트로만 import한다.

---

## 4. 슬라이스 내부 세그먼트

| 세그먼트 | 무엇을 두는가 | 기준 |
| --- | --- | --- |
| `ui/` | props만 받아 렌더링하는 컴포넌트 | 내부 상태·로직 없음 |
| `model/` | hook, store, 도메인 로직 | React에 의존하는 모든 것 |
| `lib/` | 순수 유틸, 브라우저 API 헬퍼, 상수 | React 없이 동작하는 것 |
| `config/` | 슬라이스 전용 상수·설정값 | 코드가 아닌 값 |

### shared 전용 추가 세그먼트

`shared`는 도메인이 없으므로 아래를 추가로 쓴다.

| 세그먼트 | 무엇을 두는가 | 기준 |
| --- | --- | --- |
| `ui/` | 디자인시스템 / 범용 프리미티브 | 도메인 지식 없는 UI |
| `hooks/` | 도메인 무관 범용 hook | React 의존 + 도메인 지식 없음 |
| `api/` | BFF(`/api/*`) 호출 공통 헬퍼 | 클라이언트→서버 통신 유틸 |
| `lib/` | 순수 유틸·상수 | React 없이 동작 |

- `shared/hooks/` 예: `useStorageState`, `useDebounce`, `useMediaQuery`
- React hook은 절대 `shared/lib/`에 두지 않는다 → 반드시 `shared/hooks/`.

### feature 루트 컴포넌트 역할

feature 루트는 state·action을 보유하고 `model/` hook을 호출하는 **조립 지점**이다.

- **`ui/`로 분리하는 기준**: 상태별 마크업이 충분히 달라 루트에 다 두면 흐름 파악이 어려울 때.
- **루트에 마크업을 둬도 되는 경우**: 포지셔닝 컨테이너, 로딩 오버레이, 단순 UI 변형.
  분리 기준이 안 되는 JSX를 억지로 빼서 의미 없는 Wrapper 파일을 만들지 않는다.

---

## 5. 전역 상태 관리 (Zustand)

전역 상태는 React Context 대신 **Zustand**를 쓴다.

- **서버 초기 데이터가 필요한 경우**: Context에 store **레퍼런스**를 담는 패턴.
- **클라이언트 전용 singleton**: `create()`로 모듈 레벨 생성.
- 소비자는 **셀렉터**로 필요한 슬라이스만 구독: `useStore(s => s.value)`.
- Context에 값을 직접 담지 않는다 (레퍼런스만).

### store의 역할 범위

store는 **UI가 즉시 필요한 클라이언트 상태**만. 서버 데이터·캐시는 TanStack Query에.

- 넣는 것: 세션 한정 UI 상태 (모달 open, 선택된 탭 등)
- 넣지 않는 것: 서버에서 온 데이터, 다른 state에서 파생 가능한 값

### 액션은 메서드로, state 직접 수정 금지

- 컴포넌트·hook에서 state 필드를 직접 조작하지 않는다.
- store는 **의도가 드러나는 액션(메서드)**만 외부에 노출한다. (한 액션 = 한 사용자 의도)

### 읽기도 메서드로 캡슐화

내부 자료구조를 셀렉터에서 직접 꺼내지 않는다. store에 읽기 메서드를 두고 셀렉터에서 호출한다.

```ts
// ✅ useStore((s) => s.getValue(id))   — 셀렉터 안에서 호출, 반응성 유지
// ❌ useStore((s) => s.getValue)(id)   — 함수 레퍼런스만 구독, 반응성 깨짐
```

---

## 6. entities — TanStack Query 패턴

서버 데이터를 다루는 entity는 아래 구조를 따른다.

```
entities/{slice}/
├── api.ts            # fetch 함수 — 요청/응답 타입 정의 포함
├── factory.ts        # queryOptions, mutationOptions (queryClient 파라미터 패턴)
├── model/
│   ├── use-*-data.ts # useQuery + useMutation (Raw Data 위주)
│   └── use-*.ts      # 소비자 hook — 비즈니스 로직
└── index.ts
```

- `factory.ts`의 `mutationOptions`는 `(userId, queryClient)` 형태로 **캐시 전략을 함께** 정의한다.
- `use-*-data.ts`는 데이터 레이어만, `use-*.ts`는 비즈니스 로직.
- entity hook은 상위 레이어(`app`, `screens`, `features`)를 import하지 않는다. 필요한 값은 파라미터로 받는다.

---

## 7. BFF API route (`app/api/`)

클라이언트 → 서버 데이터 통신은 `/api/` 경로를 경유한다.

- **인증**: `proxy.ts`(또는 `middleware.ts`)에서 Bearer 토큰 검증 후 `x-user-id` 헤더로 주입.
  route handler는 `request.headers.get('x-user-id')`만 읽는다.
- **새 보호 라우트 추가**: `PROTECTED_API_PREFIXES` 배열에만 추가한다.
- route handler는 **controller만** 호출한다. dao를 직접 import하지 않는다.

---

## 8. 서버 레이어 (`server/`)

FSD와 별도로 서버 전용 코드는 `server/`에 3계층으로 구성한다.

```
server/
├── db/          # DB 클라이언트 팩토리
├── dao/         # 테이블 단위 raw DB 접근 — 'use server' 없음
├── controllers/ # dao 호출 + 캐시 무효화 — 외부 노출 유일 진입점
├── lib/         # 서버 공통 유틸
└── types/       # 서버 공통 타입
```

- **dao**: 순수 DB 접근만. 프레임워크 비의존. 파일은 테이블(도메인) 단위.
- **controllers**: dao 호출 + 캐시 무효화(`revalidatePath`/`revalidateTag`) 처리.
  - 클라이언트 컴포넌트에서 직접 호출 → `'use server'` 선언
  - API route(`app/api/`)에서만 호출 → `'use server'` 불필요
- `app/`, `screens/` 등에서는 **controller만 import**. dao 직접 import 금지.
- 타입은 dao에 정의하고, controller가 `export type { ... } from`으로 노출한다.

### 네이밍: DAO ↔ Controller

| 구분 | DAO | Controller |
| --- | --- | --- |
| 읽기 | `find*` | `fetch*` |
| 생성 | `insert*` | `create*` |
| 수정 | `update*` | `modify*` |
| 삭제 | `delete*` | `remove*` |
| 집계 | `count*` | — |

---

## 9. import 규칙 빠른 참조

| 상황 | 규칙 |
| --- | --- |
| 레이어 간 | 상위 → 하위만. 역방향·동일레이어 슬라이스 간 ❌ |
| 슬라이스 진입 | 항상 `index.ts`(Public API)로만 |
| 경로 | `@/*` 절대경로. 슬라이스 내부만 상대경로 |
| 화면 코드 | `app/`이 아니라 `screens/`에 |
| 서버 접근 | 컴포넌트 → controller만. dao 직접 ❌ |
| 서버 상태 | TanStack Query / 클라이언트 UI 상태 | Zustand |
