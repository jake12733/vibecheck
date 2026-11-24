/* VIBECHECK · 수익화 · 연락처 · 도메인 · 애드센스 중앙 설정 파일
 * 나중에 연락처 / 카톡 오픈채팅 / Formspree / 애드센스 / 커스텀 도메인이 준비되면
 * 이 파일의 빈 문자열('')만 채우고 푸시하면 전체 사이트에 자동 반영됩니다.
 */
window.VIBE_CONFIG = {
  // 1) 커스텀 도메인 구매 후 변경 (예: 'https://vibecheck.kr')
  siteUrl: 'https://jake12733.github.io/vibecheck',

  // 2) 프리랜서 보안·리팩토링 의뢰 실제 수신 채널 (원하는 것 1개 이상 입력)
  contactEmail: '',           // 예: 'security@vibecheck.kr' (입력 시 mailto 자동 연동)
  kakaoOpenChatUrl: '',       // 예: 'https://open.kakao.com/o/xxxxxxxx' (입력 시 카톡 오픈채팅 버튼 활성)
  formspreeEndpoint: '',      // 예: 'https://formspree.io/f/xxxxxxxx' (무료 월 50건 이메일 자동 발송!)

  // 3) 구글 애드센스 승인 후 게시자 ID 입력 (예: 'ca-pub-1234567890123456')
  adsenseClient: '',

  // 4) 제휴 마케팅 링크 (실제 Affiliate/Referral 링크 발급 후 교체)
  affiliates: [
    { name: 'Vercel', url: 'https://vercel.com', tag: 'DEPLOY' },
    { name: 'Cloudflare Pages', url: 'https://pages.cloudflare.com', tag: 'CDN' },
    { name: 'Supabase', url: 'https://supabase.com', tag: 'DB·AUTH' },
  ],
};
