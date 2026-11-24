# VIBECHECK 도메인 · 검색엔진 · 수익화 연결 3분 가이드

## 1. 커스텀 도메인 연결 (DNS 설정 3줄)
도메인(가비아·호스팅KR·Cloudflare·Namecheap 등, `.com` / `.kr` / `.dev` 추천)을 구매한 뒤 DNS 관리에서 아래 레코드를 추가하세요.

1. **루트 도메인 (`@`) A 레코드 4개 추가**:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. **`www` CNAME 레코드 1개 추가**:
   - 호스트: `www` → 값: `jake12733.github.io`
3. **GitHub 저장소 설정**:
   - `CNAME.example` 파일 이름을 `CNAME`으로 바꾸고 안에 구매한 도메인(예: `vibecheck.kr`) 한 줄만 저장
   - GitHub 저장소 `Settings → Pages → Enforce HTTPS` 체크
   - `assets/config.js`, `robots.txt`, `sitemap.xml`, `index.html`의 `canonical` URL을 새 도메인으로 교체

---

## 2. 구글 서치콘솔 & 네이버 서치어드바이저 등록
1. **Google Search Console** (`search.google.com/search-console`) → URL 접두어 등록 → HTML 태그 복사 → `index.html`의 `google-site-verification` 주석 해제 후 붙여넣기 → `sitemap.xml` 제출
2. **네이버 서치어드바이저** (`searchadvisor.naver.com`) → 웹마스터 도구 → 사이트 추가 → HTML 태그 복사 → `index.html`의 `naver-site-verification` 주석 해제 후 붙여넣기 → `sitemap.xml` 및 `robots.txt` 검증

---

## 3. 실제 의뢰 수신 · 애드센스 · 제휴 수익 활성화 (`assets/config.js`)
`assets/config.js` 한 파일만 열어서 빈 값을 채우면 즉시 작동합니다.

- **실제 이메일 자동 알림 (무료 월 50건)**: [Formspree.io](https://formspree.io) 무료 가입 → 폼 생성 → 발급된 `https://formspree.io/f/xxxxxxx` 주소를 `formspreeEndpoint`에 입력
- **카카오톡 오픈채팅 바로 연결**: 오픈채팅방 링크를 `kakaoOpenChatUrl`에 입력
- **이메일 직접 발송**: `contactEmail`에 본인 이메일 입력
- **구글 애드센스**: 커스텀 도메인 연결 후 애드센스 신청 → 승인된 `ca-pub-...` ID를 `adsenseClient`에 입력
