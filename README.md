# CRS (Congestion & Restaurant Service) — Frontend

식당의 **실시간 혼잡도**와 **리뷰**를 카카오 지도 위에서 제공하는 서비스의 프론트엔드(React)입니다.
지도에서 주변 식당을 탐색하고, 혼잡도를 확인·제보하며, 리뷰·즐겨찾기를 남기고, 제보로 모은 **포인트로 쿠폰을 교환**할 수 있습니다.
사용자 유형(일반 / 상인 / 관리자)에 따라 마이페이지와 기능이 분기됩니다.

> 백엔드(Spring Boot)는 별도 저장소입니다. 이 앱은 개발 시 `http://localhost:8080`으로 API를 프록시합니다.

---

## 기술 스택

| 구분 | 사용 기술 |
| :--- | :--- |
| Library | React 19 |
| Bootstrapping | Create React App (react-scripts 5) |
| 라우팅 | react-router-dom v7 |
| HTTP | axios (응답 인터셉터로 401 세션 만료 처리) |
| 지도 | Kakao Maps JavaScript SDK (`services` 라이브러리 — 장소 검색) |
| UI | react-icons, react-modal |
| 상태 관리 | React Context (`AuthContext`) + `sessionStorage` |

---

## 폴더 구조

```
src/
├── App.js                  # 라우트 정의
├── index.js                # 진입점
├── context/
│   └── AuthContext.js      # 로그인 상태(역할/userIdx) + 401 인터셉터
├── components/
│   ├── map/                # 카카오 지도, 현재 위치, 지도 컨트롤
│   ├── congestion/         # 혼잡도 변경/이력 패널
│   ├── reward/             # 리워드/쿠폰 패널 (포인트·보유쿠폰·교환)
│   └── ui/                 # Header, 회원탈퇴 모달 등 공용 UI
└── pages/
    ├── home/               # 메인(지도 + 식당 목록)
    ├── auth/               # 로그인 / 유형선택 / 약관 / 회원가입(일반·상인·관리자)
    ├── restaurant/         # 식당 상세 + 탭(홈·메뉴·사진·리뷰)
    └── mypage/             # 마이페이지
        ├── user/           # 일반: 내정보·리워드·즐겨찾기·내리뷰·내혼잡도제보
        ├── merchant/       # 상인: 가게 등록·수정/삭제·혼잡도 관리·쿠폰 관리·내정보
        └── admin/          # 관리자: 회원·가게·신고 관리
```

---

## 주요 기능

- **지도 기반 탐색** — 카카오 지도에 주변 식당 핀 표시, 현재 위치 이동, 지도 타입 전환. 식당별 평점/리뷰수·혼잡도를 일괄 조회(`bulkDetails`, `bulkStatus`)로 효율 로딩.
- **혼잡도 확인·제보** — 식당별 현재 혼잡도 조회 및 제보, 내 제보 이력 확인.
- **리뷰** — 식당 상세에서 리뷰 조회/작성, 마이페이지에서 내 리뷰 페이징 조회·수정·삭제, 리뷰 신고.
- **즐겨찾기** — 식당 즐겨찾기 토글 및 목록 관리.
- **리워드 & 쿠폰** — 혼잡도 제보로 포인트 적립, 마이페이지 리워드 패널에서 보유 포인트 확인. 포인트로 가게 쿠폰을 교환하고 보유 쿠폰을 사용. 상인은 자기 가게 쿠폰을 등록·관리.
- **3종 회원 + 마이페이지 분기** — 일반/상인/관리자별 회원가입·약관·마이페이지.
  - 상인: 가게 등록(메뉴·편의시설·이미지), 수정/삭제, 혼잡도 관리, 쿠폰 등록/관리
  - 관리자: 가게 승인/거절, 회원 제재/탈퇴, 리뷰 신고 처리

---

## 라우트

| Path | 화면 |
| :--- | :--- |
| `/` | 메인 (지도 + 식당 목록) |
| `/login` | 로그인 |
| `/usertypeselection` | 회원 유형 선택 |
| `/terms/general` `/terms/merchant` `/terms/admin` | 약관 동의 |
| `/signup/general` `/signup/merchant` `/signup/admin` | 회원가입 |
| `/mypage` | 마이페이지 (역할에 따라 하위 패널 분기) |
| `/merchant/register` | 상인: 가게 등록 |
| `/merchant/manage` | 상인: 가게 선택 → 수정/삭제 |
| `/restaurant-detail/:restaurantId` | 식당 상세 (홈·메뉴·사진·리뷰 탭) |

> 마이페이지의 리워드/쿠폰, 상인 쿠폰 관리는 별도 라우트가 아니라 `/mypage` 내부 패널 전환으로 동작합니다.

---

## 백엔드 연동

- 모든 API 호출은 상대 경로(`/api/...`)를 사용하며, 개발 서버에서 `package.json`의 `proxy` 설정(`http://localhost:8080`)을 통해 백엔드로 전달됩니다.
- 인증은 백엔드의 **HttpSession** 기반입니다. 로그인 성공 시 받은 `userIdx`/`role`을 `sessionStorage`에 저장하고, axios 인터셉터가 `401` 응답을 받으면 세션 만료로 간주해 로그인 페이지로 이동시킵니다.
- 사용하는 주요 API 그룹: `/api/auth`, `/api/restaurants`, `/api/congestion`, `/api/reviews`, `/api/bookmarks`, `/api/rewards`, `/api/coupons`, `/api/users` · `/api/merchants` · `/api/admins`. 자세한 스펙은 백엔드 저장소 README 참고.

---

## 로컬 실행 방법

### 1. 사전 준비
- Node.js 18+ 권장
- **카카오 지도 JavaScript 키** ([Kakao Developers](https://developers.kakao.com)에서 발급, 플랫폼에 `http://localhost:3000` 등록)
- 백엔드 서버가 `http://localhost:8080`에서 실행 중이어야 API가 동작합니다.

### 2. 환경변수 설정
프로젝트 루트에 `.env` 파일을 만들고 카카오 키를 넣습니다. (`.env.example` 참고, `.env`는 git에 커밋되지 않습니다.)
```
REACT_APP_KAKAO_MAPS_API_KEY=발급받은_자바스크립트_키
```
> 이 값은 `public/index.html`의 카카오 SDK `<script>` 태그에 주입됩니다. 키가 없으면 지도가 로드되지 않습니다.

### 3. 설치 & 실행
```bash
npm install
npm start        # http://localhost:3000 개발 서버

npm run build    # 프로덕션 빌드 (build/)
npm test         # 테스트 러너
```

---

## 🚧 아직 정리/개선이 필요한 부분

저장소를 점검하며 발견한 항목입니다.

1. **인증 엔드포인트 경로 불일치** — `AuthContext`의 401 인터셉터가 `/api/users/login`·`/api/users/signup`을 예외 처리하지만, 실제 경로는 `/api/auth/login`·`/api/auth/register/*`. 해당 조건이 동작하지 않으므로 경로를 맞춰야 함.
2. **세션 / 명시적 userIdx 혼용** — 일부 호출은 세션 쿠키(`withCredentials`)에, 일부는 `userIdx`를 직접 전달해 의존(리뷰·리워드·쿠폰 등). 백엔드 인증 정리와 함께 한쪽으로 통일 권장.
3. **ESLint 경고 잔존** — `MyReviewsPanel.js`의 미사용 변수(`totalElements`) 등 사소한 경고. 정리 권장.

---

## 관련 저장소
- **Backend** — Spring Boot + MySQL API 서버 (별도 저장소). 식당/혼잡도/리뷰/회원/리워드/쿠폰 API 제공.
