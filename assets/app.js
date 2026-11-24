/* VIBECHECK · App Controller, KR/EN i18n, Live Terminal, Share & Freelance CTA */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const I18N = {
    ko: {
      navScan: '무료 진단', navHow: '측정 원리', navFix: '보안 수정 의뢰', btnHistory: '최근 기록',
      heroBadge: 'API 비용 0원 · 100% 브라우저 정적 분석 · 로그인 불필요',
      heroTitle: '내 프로젝트, <em>AI 냄새 몇 %</em>?<br>그리고 <em>보안 폭탄</em>은 없을까?',
      heroSub: 'GitHub 공개 저장소 URL만 넣으면 커밋 패턴·AI 흔적·API 키 노출·보안 구멍·SEO를 10초 만에 정적 진단하고, X·레딧·긱뉴스 공유용 결과 카드를 즉시 만들어 드립니다.',
      tabGithub: 'GitHub 레포지토리 URL 진단', tabCode: '코드 / HTML 직접 붙여넣기',
      btnScan: '무료 정밀 진단 →', btnScanCode: '코드 즉시 진단 →', tryDemo: '빠른 테스트:',
      tokenOpt: '⚙ GitHub Personal Token 입력 (선택 · 미입력 시 시간당 60회 / 입력 시 5,000회)',
      tokenNote: '공개 저장소는 토큰 없이 바로 진단 가능합니다. 단시간에 여러 레포를 연속 검사할 때만 입력하세요.',
      adSlotTop: '바이브코딩으로 만든 프로젝트, <b>Vercel · Cloudflare Pages · Supabase</b> 무료 티어로 3분 만에 배포하세요.',
      btnSaveCard: '결과 이미지 카드 저장 (PNG)', btnCopyShare: 'X·레딧 공유 문구 복사',
      stratALabel: 'STRATEGY A · VIBE-CODING INDEX', funTag: '재미 · 패턴 진단', vibePure: 'AI 순도',
      vibeDisclaimer: '* 커밋 규모·AI 설정파일·주석 스타일·스택 조합을 정적 분석한 재미·참고용 지표이며, AI 사용 여부를 법적·학술적으로 단정하지 않습니다.',
      stratBLabel: 'STRATEGY B · SECURITY & QUALITY AUDIT', factTag: '100% 객관적 팩트',
      auditFixTeaser: '치명적 보안 구멍·구조 문제가 발견되셨나요?', btnFixNow: '전문가 수정 의뢰 →',
      shareCardTitle: 'X · 레딧 · 긱뉴스 공유용 결과 카드 미리보기', btnDlPng: 'PNG 다운로드',
      findingsTitle: '상세 진단 리포트 & 해결 가이드', fAll: '전체', fCrit: '치명/주의', fSec: '보안·키 노출', fVibe: '바이브코딩 신호', fQual: 'SEO·코드 품질',
      commitSnapTitle: '최근 커밋 패턴 분석', fileSnapTitle: '정적 검사 완료 파일 목록',
      howTitle: '어떻게 API 비용 0원으로 정확하게 진단할까요?',
      how1T: '커밋 폭발력 & AI 흔적 분석', how1D: '공개 커밋 히스토리에서 한 번에 수천 줄이 추가된 비율, 초단기 대규모 생성, .cursorrules·CLAUDE.md·Co-Authored-By 흔적과 AI 특유의 주석·스택 패턴을 수치화합니다.',
      how2T: 'API 키 노출 · 보안 구멍 팩트체크', how2D: '실제 소스 파일을 직접 읽어 OpenAI·Google·AWS·Stripe·GitHub 토큰 노출, .env 커밋 실수, innerHTML XSS 취약점, eval() 위험 패턴을 파일명·줄 번호 단위로 찾아냅니다.',
      how3T: '품질 점수 + 바이럴 이미지 카드', how3D: 'SEO 메타태그·테스트 유무·초대형 단일 파일 비대화를 종합 채점하고, 1200×630 고해상도 PNG 결과 카드를 브라우저에서 0.1초 만에 렌더링해 커뮤니티에 바로 공유할 수 있습니다.',
      ctaTitle: '진단에서 발견된 보안 구멍·구조 문제,<br>24시간 내 직접 안전하게 고쳐드립니다.',
      ctaDesc: '바이브코딩으로 빠르게 만든 MVP, 배포 전에 API 키 은닉·인증 보안·SEO 최적화·성능 튜닝까지 실무 엔지니어가 깔끔하게 마무리해 드립니다. (사업자 없이 프리랜서 3.3% 계약 가능)',
      ctaBtn: '보안 · 코드 리팩토링 의뢰하기 →', ctaSub: '평균 견적 회신 2시간 이내 · 진단 리포트 자동 첨부',
      ftrSub: 'GitHub 바이브코딩 지수 측정기 & AI 보안·품질 건강검진기',
      ftrPrivacy: '모든 검사는 사용자의 브라우저에서 직접 실행되며, 입력한 코드나 GitHub 토큰은 외부 서버에 저장되지 않습니다.',
      fixModalTitle: '보안 · 품질 문제 해결 의뢰', fixModalSub: '진단된 레포지토리와 발견된 핵심 이슈가 자동으로 요약됩니다. 연락처를 남겨주시면 해결 견적과 소요 일정을 안내드립니다.',
      lblRepo: '대상 레포지토리 / 사이트 URL', lblContact: '회신받을 이메일 또는 카카오톡 ID', lblScope: '발견된 문제 및 요청 사항', btnSendFix: '의뢰서 생성 및 접수하기 →',
      histTitle: '최근 진단 기록 (이 브라우저 저장)',
    },
    en: {
      navScan: 'Free Scan', navHow: 'How It Works', navFix: 'Hire Security Fix', btnHistory: 'History',
      heroBadge: '$0 API Cost · 100% Client-Side Static Audit · No Login',
      heroTitle: 'How <em>AI-Vibed</em> is Your Repo?<br>Any <em>Security Timebombs</em> Inside?',
      heroSub: 'Paste any public GitHub URL to measure its Vibe-Coding Purity Index (%) and run an objective Security, API-Key Leak & SEO audit in 10 seconds — plus export a viral 1200×630 PNG badge card.',
      tabGithub: 'GitHub Repository URL', tabCode: 'Paste Code / HTML Directly',
      btnScan: 'Run Free Audit →', btnScanCode: 'Audit Code Now →', tryDemo: 'Try Live:',
      tokenOpt: '⚙ Optional GitHub Token (60 req/hr without token · 5,000 req/hr with token)',
      tokenNote: 'Public repos work with zero setup. Only add a token if scanning many repos rapidly.',
      adSlotTop: 'Shipped with vibe coding? Deploy cleanly on <b>Vercel · Cloudflare Pages · Supabase</b> free tiers in 3 minutes.',
      btnSaveCard: 'Download Result Card (PNG)', btnCopyShare: 'Copy X / Reddit Share Text',
      stratALabel: 'STRATEGY A · VIBE-CODING INDEX', funTag: 'Fun Heuristic', vibePure: 'Vibe Purity',
      vibeDisclaimer: '* Entertaining static heuristic based on commit bursts, AI config files, comment style, and stack mix — not a legal or academic AI detector.',
      stratBLabel: 'STRATEGY B · SECURITY & QUALITY AUDIT', factTag: '100% Objective Facts',
      auditFixTeaser: 'Found leaked keys or structural issues before launch?', btnFixNow: 'Request 24h Fix →',
      shareCardTitle: 'Viral Share Card Preview (X · Reddit · Product Hunt)', btnDlPng: 'Download PNG',
      findingsTitle: 'Detailed Diagnostics & Remediation Guide', fAll: 'All', fCrit: 'Critical / High', fSec: 'Security & Leaks', fVibe: 'Vibe Signals', fQual: 'SEO & Quality',
      commitSnapTitle: 'Recent Commit Velocity', fileSnapTitle: 'Scanned Source Files',
      howTitle: 'How Does It Audit Everything at $0 Server Cost?',
      how1T: 'Commit Bursts & AI Footprints', how1D: 'Inspects public git history for massive single-commit dumps, rapid-fire intervals, .cursorrules / CLAUDE.md / Co-Authored-By trailers, and signature AI stack combos.',
      how2T: 'Objective Secret & XSS Scanner', how2D: 'Reads raw source files directly in your browser to catch leaked OpenAI/AWS/Stripe/Google/GitHub keys, committed .env files, innerHTML XSS sinks, and eval() risks.',
      how3T: 'Health Grade + Viral OG Card', how3D: 'Scores SEO meta tags, test coverage, and monolithic file bloat, then renders a crisp 1200×630 PNG badge card in 0.1s ready for X, Reddit, and Hacker News.',
      ctaTitle: 'Found Security Leaks or Messy Vibe-Code?<br>Get It Production-Hardened in 24 Hours.',
      ctaDesc: 'We clean up leaked keys, lock down auth/XSS, fix SEO & Core Web Vitals, and refactor bloated vibe-coded MVPs into clean production apps.',
      ctaBtn: 'Request Security & Code Refactor →', ctaSub: 'Average quote within 2 hours · Audit summary attached',
      ftrSub: 'GitHub Vibe-Coding Index & AI Security/Quality Auditor',
      ftrPrivacy: 'All analysis runs locally in your browser. Neither your code nor optional tokens are sent to any third-party backend.',
      fixModalTitle: 'Request Security & Refactor Fix', fixModalSub: 'Your scanned repository and critical findings are pre-filled below. Leave your contact to receive a fast fix quote.',
      lblRepo: 'Repository / Site URL', lblContact: 'Your Email or Contact Handle', lblScope: 'Issues & Scope', btnSendFix: 'Create & Submit Request →',
      histTitle: 'Recent Scans (Saved Locally)',
    },
  };

  let lang = localStorage.getItem('vc_lang') || 'ko';
  let scanMode = 'github';
  let currentReport = null;
  let currentFilter = 'all';

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('on'), 2400);
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function applyI18n() {
    const dict = I18N[lang] || I18N.ko;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => {
      const k = el.dataset.i18n;
      if (dict[k]) el.innerHTML = dict[k];
    });
    $$('#langSeg button').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
    if (currentReport) renderReport(currentReport);
  }

  function saveHistory(rep) {
    try {
      const list = JSON.parse(localStorage.getItem('vc_hist') || '[]').filter((x) => x.repoFullName !== rep.repoFullName);
      list.unshift({ repoFullName: rep.repoFullName, vibe: rep.vibe.score, grade: rep.audit.grade, audit: rep.audit.score, t: Date.now(), report: rep });
      localStorage.setItem('vc_hist', JSON.stringify(list.slice(0, 12)));
    } catch {}
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem('vc_hist') || '[]'); } catch { return []; }
  }

  function renderFindings(rep) {
    const isEn = lang === 'en';
    const box = $('#findingsList');
    const items = rep.findings.filter((f) => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'critical') return f.severity === 'critical' || f.severity === 'high';
      return f.category === currentFilter;
    });
    if (!items.length) {
      box.innerHTML = `<div class="fitem"><span class="fbadge pass">CLEAN</span><div class="fbody"><h4>${isEn ? 'No issues in this category' : '해당 카테고리에 발견된 문제가 없습니다'}</h4><p>${isEn ? 'Everything looks clean for this filter.' : '현재 필터 기준 이슈가 발견되지 않았습니다.'}</p></div></div>`;
      return;
    }
    box.innerHTML = items.map((f) => `
      <article class="fitem sev-${f.severity}">
        <span class="fbadge ${f.severity}">${f.severity}</span>
        <div class="fbody">
          <h4>${esc(isEn ? f.titleEn : f.titleKo)}</h4>
          <p>${esc(isEn ? f.descEn : f.descKo)}</p>
          <div class="fmeta">
            ${f.file ? `<span class="fcode">${esc(f.file)}</span>` : ''}
            <span class="mono" style="color:var(--mut)">${esc(f.category.toUpperCase())}</span>
          </div>
          ${(isEn ? f.fixEn : f.fixKo) ? `<div class="ffix">→ ${esc(isEn ? f.fixEn : f.fixKo)}</div>` : ''}
        </div>
      </article>
    `).join('');
  }

  function renderReport(rep) {
    currentReport = rep;
    const isEn = lang === 'en';
    $('#resultsSec').hidden = false;
    $('#resRepoMeta').textContent = `${rep.language.toUpperCase()} · ${rep.totalFiles.toLocaleString()} FILES · ${rep.totalLinesScanned.toLocaleString()} LINES SCANNED${rep.stars ? ` · ★ ${rep.stars.toLocaleString()}` : ''}`;
    $('#resRepoTitle').textContent = rep.repoFullName;
    $('#resRepoDesc').textContent = rep.description || (isEn ? 'Static client-side security & vibe-coding audit complete.' : '100% 브라우저 정적 분석 리포트가 완료되었습니다.');
    const ghLink = $('#openRepoLink');
    if (rep.repoUrl) { ghLink.href = rep.repoUrl; ghLink.hidden = false; } else { ghLink.hidden = true; }

    // Gauges (circumference = 2 * PI * 50 = 314.16)
    const C = 314.16;
    $('#vibeScore').textContent = `${rep.vibe.score}%`;
    $('#vibeArc').style.strokeDashoffset = String(C * (1 - rep.vibe.score / 100));
    $('#vibeBadge').textContent = isEn ? rep.vibe.personaEn : rep.vibe.personaKo;
    $('#vibeHeadline').textContent = isEn ? rep.vibe.headEn : rep.vibe.headKo;
    $('#vibeSummary').textContent = isEn ? rep.vibe.sumEn : rep.vibe.sumKo;
    $('#vibeBreakdown').innerHTML = rep.vibe.breakdown.map((b) => `
      <div class="sbar-row">
        <div class="sbar-top"><span>${esc(isEn ? b.labelEn : b.labelKo)}</span><b>${b.score}/100</b></div>
        <div class="sbar-trk"><i style="width:${b.score}%"></i></div>
      </div>
    `).join('');

    const gradeColor = rep.audit.score >= 85 ? 'var(--em)' : rep.audit.score >= 65 ? 'var(--amb)' : 'var(--red)';
    $('#auditGrade').textContent = rep.audit.grade;
    $('#auditGrade').style.color = gradeColor;
    $('#auditArc').style.stroke = gradeColor;
    $('#auditArc').style.strokeDashoffset = String(C * (1 - rep.audit.score / 100));
    $('#auditScoreSub').textContent = `${rep.audit.score} / 100`;
    $('#sevPills').innerHTML = `
      <span class="sp crit">${isEn ? 'CRITICAL' : '치명'} ${rep.audit.counts.critical}</span>
      <span class="sp warn">${isEn ? 'HIGH' : '주의'} ${rep.audit.counts.high}</span>
      <span class="sp ok">${isEn ? 'PASS' : '통과'} ${rep.audit.counts.pass}</span>
    `;
    $('#auditHeadline').textContent = isEn ? rep.audit.headlineEn : rep.audit.headlineKo;
    $('#auditSummary').textContent = isEn ? rep.audit.summaryEn : rep.audit.summaryKo;
    $('#auditBreakdown').innerHTML = rep.audit.breakdown.map((b) => `
      <div class="sbar-row">
        <div class="sbar-top"><span>${esc(isEn ? b.labelEn : b.labelKo)}</span><b>${b.score}/100</b></div>
        <div class="sbar-trk"><i style="width:${b.score}%;background:${b.score >= 80 ? 'var(--em)' : b.score >= 60 ? 'var(--amb)' : 'var(--red)'}"></i></div>
      </div>
    `).join('');

    renderFindings(rep);

    // Commits & Files
    $('#commitList').innerHTML = rep.commits.length
      ? rep.commits.map((c) => `<div class="crow"><span><code style="color:var(--mut);margin-right:6px">${esc(c.sha)}</code>${esc(c.message)}</span><b>${c.additions ? `+${c.additions} / -${c.deletions}` : (c.date || '').slice(0, 10)}</b></div>`).join('')
      : `<div class="crow"><span>${isEn ? 'No commit history available' : '커밋 히스토리 없음'}</span></div>`;
    $('#scannedFileList').innerHTML = rep.scannedFiles.map((f) => `<div class="frow"><span>${esc(f.path)}</span><b>${f.lines.toLocaleString()} lines</b></div>`).join('');

    // Render 1200x630 viral OG share card
    window.VibeShareCard?.renderShareCard($('#shareCanvas'), rep, lang);
  }

  function buildShareText(rep) {
    const url = location.origin + location.pathname;
    if (lang === 'en') {
      return `Just audited ${rep.repoFullName} on VIBECHECK ⚡\n• Vibe-Coding Purity: ${rep.vibe.score}% (${rep.vibe.personaEn})\n• Security & Quality Health: ${rep.audit.grade} (${rep.audit.score}/100 · ${rep.audit.counts.critical} critical)\n\nTest your repo free (0 API cost): ${url}`;
    }
    return `방금 VIBECHECK으로 ${rep.repoFullName} 정적 진단해봤습니다 ⚡\n• 바이브코딩 순도: ${rep.vibe.score}% (${rep.vibe.personaKo})\n• 보안·품질 건강등급: ${rep.audit.grade} (${rep.audit.score}/100 · 치명 이슈 ${rep.audit.counts.critical}건)\n\n내 GitHub 레포도 10초 무료 진단하기: ${url}`;
  }

  function downloadCardPng() {
    if (!currentReport) return;
    const cv = $('#shareCanvas');
    const a = document.createElement('a');
    a.download = `vibecheck-${currentReport.repoFullName.replace(/[^a-z0-9_-]/gi, '-')}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
    toast(lang === 'en' ? 'Result PNG card saved!' : '1200×630 공유용 PNG 카드가 저장되었습니다!');
  }

  async function runScan(e) {
    if (e) e.preventDefault();
    const err = $('#errBanner');
    err.hidden = true;
    const term = $('#termBox');
    const log = $('#termLog');
    term.hidden = false;
    log.innerHTML = '';
    $('#termBar').style.width = '5%';
    $('#termPct').textContent = '5%';

    const onStep = (pct, msg, cls = '') => {
      $('#termBar').style.width = `${pct}%`;
      $('#termPct').textContent = `${pct}%`;
      $('#termStatus').textContent = pct >= 100 ? 'AUDIT COMPLETE' : 'SCANNING…';
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.textContent = `[${String(pct).padStart(3, ' ')}%] ${msg}`;
      log.append(d);
      log.scrollTop = log.scrollHeight;
    };

    const btn = scanMode === 'github' ? $('#scanBtn') : $('#scanCodeBtn');
    btn.disabled = true;
    try {
      let rep;
      if (scanMode === 'github') {
        const val = $('#repoInput').value.trim();
        const tok = $('#ghTokenInput').value.trim();
        rep = await window.VibeAnalyzer.analyzeGitHubRepo(val, { token: tok, onStep });
      } else {
        const code = $('#rawCodeInput').value;
        if (!code.trim()) throw new Error(lang === 'en' ? 'Please paste code to analyze.' : '진단할 코드를 먼저 붙여넣어 주세요.');
        rep = window.VibeAnalyzer.analyzeRawCode($('#codeNameInput').value, code, onStep);
      }
      saveHistory(rep);
      renderReport(rep);
      $('#resultsSec').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (ex) {
      onStep(100, `ERROR: ${ex.message}`, 'err');
      err.textContent = ex.message;
      err.hidden = false;
    } finally {
      btn.disabled = false;
    }
  }

  function openFixModal() {
    if (currentReport) {
      $('#fixRepo').value = currentReport.repoUrl || currentReport.repoFullName;
      const topIssues = currentReport.findings
        .filter((f) => f.severity === 'critical' || f.severity === 'high')
        .slice(0, 4)
        .map((f) => `- [${f.severity.toUpperCase()}] ${lang === 'en' ? f.titleEn : f.titleKo} (${f.file || ''})`)
        .join('\n');
      $('#fixNotes').value = topIssues
        ? `${lang === 'en' ? 'Detected issues to fix:' : '진단에서 발견된 수정 요청 항목:'}\n${topIssues}\n`
        : `${lang === 'en' ? 'General security hardening & SEO/performance refactor request for' : '전반적인 보안 점검 및 코드 리팩토링 의뢰:'} ${currentReport.repoFullName}`;
    }
    $('#fixResult').hidden = true;
    $('#fixModal').hidden = false;
  }

  // Event wiring
  $('#scanForm').addEventListener('submit', runScan);
  $$('#scanModeTabs button').forEach((b) => b.addEventListener('click', () => {
    scanMode = b.dataset.mode;
    $$('#scanModeTabs button').forEach((x) => x.classList.toggle('on', x === b));
    $('#githubInputWrap').hidden = scanMode !== 'github';
    $('#codeInputWrap').hidden = scanMode !== 'code';
  }));
  $$('.demo-chip').forEach((b) => b.addEventListener('click', () => {
    scanMode = 'github';
    $$('#scanModeTabs button').forEach((x) => x.classList.toggle('on', x.dataset.mode === 'github'));
    $('#githubInputWrap').hidden = false;
    $('#codeInputWrap').hidden = true;
    $('#repoInput').value = b.dataset.repo;
    runScan();
  }));
  $$('#langSeg button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang;
    localStorage.setItem('vc_lang', lang);
    applyI18n();
  }));
  $$('#findingTabs button').forEach((b) => b.addEventListener('click', () => {
    currentFilter = b.dataset.f;
    $$('#findingTabs button').forEach((x) => x.classList.toggle('on', x === b));
    if (currentReport) renderFindings(currentReport);
  }));

  $('#downloadCardBtn').onclick = downloadCardPng;
  $('#dlCardBtn2').onclick = downloadCardPng;
  $('#copyShareBtn').onclick = () => {
    if (!currentReport) return;
    navigator.clipboard?.writeText(buildShareText(currentReport));
    toast(lang === 'en' ? 'Copied share text!' : 'X·레딧·긱뉴스 공유 문구가 복사되었습니다!');
  };
  $('#shareXBtn').onclick = () => {
    if (!currentReport) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildShareText(currentReport))}`, '_blank', 'noopener,noreferrer');
  };
  $('#shareRedditBtn').onclick = () => {
    if (!currentReport) return;
    const title = `VIBECHECK Audit: ${currentReport.repoFullName} — ${currentReport.vibe.score}% Vibe-Coder · Grade ${currentReport.audit.grade}`;
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(location.href)}&title=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
  };

  $('#openFixModalBtn').onclick = openFixModal;
  $('#openFixFromCard').onclick = openFixModal;
  $('#closeFixModal').onclick = () => { $('#fixModal').hidden = true; };
  $('#fixModal').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.hidden = true; };
  $('#fixForm').onsubmit = (e) => {
    e.preventDefault();
    const summary = `[VIBECHECK 보안/리팩토링 의뢰]\n• 대상: ${$('#fixRepo').value}\n• 연락처: ${$('#fixContact').value}\n• 내용:\n${$('#fixNotes').value}`;
    try {
      const saved = JSON.parse(localStorage.getItem('vc_leads') || '[]');
      saved.unshift({ repo: $('#fixRepo').value, contact: $('#fixContact').value, notes: $('#fixNotes').value, t: new Date().toISOString() });
      localStorage.setItem('vc_leads', JSON.stringify(saved.slice(0, 20)));
    } catch {}
    navigator.clipboard?.writeText(summary).catch(() => {});
    const box = $('#fixResult');
    box.hidden = false;
    box.innerHTML = lang === 'en'
      ? '✓ Request logged & summary copied to clipboard! We will review your audit report and reply within 2 hours.'
      : '✓ 의뢰서가 정상 생성되고 클립보드에 자동 복사되었습니다! 남겨주신 연락처로 2시간 이내에 해결 견적을 안내드립니다.';
  };

  $('#openHistoryBtn').onclick = () => {
    const list = getHistory();
    const box = $('#histList');
    box.innerHTML = list.length
      ? list.map((h, i) => `<div class="hrow" data-hi="${i}"><div><b>${esc(h.repoFullName)}</b><div class="mono" style="color:var(--mut);margin-top:3px">Vibe ${h.vibe}% · Security ${h.grade} (${h.audit}/100)</div></div><span class="mono" style="color:var(--em)">열기 →</span></div>`).join('')
      : `<p style="color:var(--mut);font-size:13.5px">${lang === 'en' ? 'No scan history yet.' : '아직 진단 기록이 없습니다.'}</p>`;
    $$('.hrow', box).forEach((el) => el.onclick = () => {
      const hit = list[Number(el.dataset.hi)];
      if (hit?.report) { renderReport(hit.report); $('#histModal').hidden = true; $('#resultsSec').scrollIntoView({ behavior: 'smooth' }); }
    });
    $('#histModal').hidden = false;
  };
  $('#closeHistModal').onclick = () => { $('#histModal').hidden = true; };
  $('#histModal').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.hidden = true; };

  // Support deep link ?repo=owner/name
  const urlRepo = new URLSearchParams(location.search).get('repo');
  applyI18n();
  if (urlRepo) {
    $('#repoInput').value = urlRepo;
    runScan();
  }
})();
