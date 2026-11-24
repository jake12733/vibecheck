/* VIBECHECK · Zero-Cost Client-Side GitHub & Source Static Analyzer
 * Strategy A: Vibe-Coding Purity Index (0-100%, fun heuristic)
 * Strategy B: Security, Secret-Leak, SEO & Code-Quality Auditor (100% objective facts, 0-100 / A+~F)
 */
(function () {
  const SECRET_RULES = [
    { id: 'openai', nameKo: 'OpenAI / AI API 키 노출 의심', nameEn: 'Possible OpenAI / AI API Key', sev: 'critical', re: /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{24,}\b/g },
    { id: 'anthropic', nameKo: 'Anthropic Claude API 키 노출', nameEn: 'Anthropic Claude API Key Leaked', sev: 'critical', re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
    { id: 'aws', nameKo: 'AWS Access Key ID 노출', nameEn: 'AWS Access Key ID Leaked', sev: 'critical', re: /\bAKIA[0-9A-Z]{16}\b/g },
    { id: 'github', nameKo: 'GitHub Personal Access Token 노출', nameEn: 'GitHub Personal Access Token Leaked', sev: 'critical', re: /\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g },
    { id: 'stripe', nameKo: 'Stripe 라이브 비밀키 노출', nameEn: 'Stripe Live Secret Key Leaked', sev: 'critical', re: /\bsk_live_[A-Za-z0-9]{18,}\b/g },
    { id: 'slack', nameKo: 'Slack Bot/User 토큰 노출', nameEn: 'Slack Token Leaked', sev: 'critical', re: /\bxox[baprs]-[A-Za-z0-9-]{16,}\b/g },
    { id: 'privkey', nameKo: '프라이빗 키(PEM) 블록 노출', nameEn: 'Private Key (PEM) Block Exposed', sev: 'critical', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
    { id: 'google', nameKo: 'Google / Firebase API 키 하드코딩', nameEn: 'Hardcoded Google / Firebase API Key', sev: 'high', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
    { id: 'passwd', nameKo: '비밀번호/시크릿 문자열 하드코딩 의심', nameEn: 'Possible Hardcoded Password / Secret', sev: 'high', re: /(?:password|passwd|db_pass|jwt_secret|api_secret|secret_key)\s*[:=]\s*['"][^'"\s]{8,64}['"]/gi },
  ];

  const AI_FOOTPRINT_PATHS = [
    { re: /(?:^|\/)\.cursorrules$/i, label: '.cursorrules (Cursor AI)' },
    { re: /(?:^|\/)\.cursor\//i, label: '.cursor/ (Cursor Rules/MCP)' },
    { re: /(?:^|\/)CLAUDE\.md$/i, label: 'CLAUDE.md (Claude Code)' },
    { re: /(?:^|\/)AGENTS\.md$/i, label: 'AGENTS.md (AI Agent Instructions)' },
    { re: /(?:^|\/)\.windsurfrules$/i, label: '.windsurfrules (Windsurf AI)' },
    { re: /(?:^|\/)\.clinerules$/i, label: '.clinerules (Cline AI)' },
    { re: /(?:^|\/)\.github\/copilot-instructions\.md$/i, label: 'copilot-instructions.md' },
    { re: /(?:^|\/)\.replit$/i, label: '.replit (Replit Agent)' },
    { re: /(?:^|\/)\.lovable|lovable-tagger/i, label: 'Lovable Config' },
    { re: /(?:^|\/)\.bolt\//i, label: '.bolt/ (Bolt.new)' },
  ];

  const VIBE_DEPS = [
    'tailwindcss', 'lucide-react', 'framer-motion', 'clsx', 'tailwind-merge',
    'class-variance-authority', '@radix-ui/', 'shadcn', '@supabase/supabase-js',
    'firebase', 'openai', '@anthropic-ai/sdk', '@google/generative-ai', 'next', 'vite',
  ];

  function parseGitHubInput(raw) {
    const s = String(raw || '').trim().replace(/\/+$/, '');
    if (!s) return null;
    const m1 = s.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i);
    if (m1) return { owner: m1[1], repo: m1[2].replace(/\.git$/i, '') };
    const mPages = s.match(/(?:https?:\/\/)?([A-Za-z0-9-]+)\.github\.io\/([A-Za-z0-9_.-]+)/i);
    if (mPages) return { owner: mPages[1], repo: mPages[2] };
    const m2 = s.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
    if (m2) return { owner: m2[1], repo: m2[2].replace(/\.git$/i, '') };
    return null;
  }

  function maskSecret(val) {
    const s = String(val || '');
    if (s.length <= 12) return s.slice(0, 4) + '••••';
    return s.slice(0, 8) + '••••' + s.slice(-4);
  }

  function lineOfIndex(text, idx) {
    return text.slice(0, idx).split('\n').length;
  }

  async function ghJson(url, token) {
    const headers = { Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') {
      const reset = Number(res.headers.get('x-ratelimit-reset') || 0);
      const mins = reset ? Math.max(1, Math.ceil((reset * 1000 - Date.now()) / 60000)) : 30;
      throw new Error(`GitHub 무료 API 한도(시간당 60회)에 도달했습니다. 약 ${mins}분 후 재시도하거나 상단에서 개인 GitHub 토큰을 입력해 주세요. (또는 [코드 직접 붙여넣기] 탭은 무제한 무료입니다!)`);
    }
    if (res.status === 404) throw new Error('저장소를 찾을 수 없습니다. 공개(Public) GitHub 저장소 주소가 맞는지 확인해 주세요.');
    if (!res.ok) throw new Error(`GitHub API 오류 (HTTP ${res.status})`);
    return res.json();
  }

  function pickFilesToScan(treeItems) {
    const blobs = treeItems.filter((t) => t.type === 'blob' && t.size > 0 && t.size < 220000);
    const priority = [];
    const addMatch = (re, limit = 2) => {
      let c = 0;
      for (const b of blobs) {
        if (priority.includes(b)) continue;
        if (/node_modules\/|dist\/|build\/|\.min\.|package-lock|yarn\.lock|pnpm-lock/i.test(b.path)) continue;
        if (re.test(b.path)) {
          priority.push(b);
          if (++c >= limit) break;
        }
      }
    };
    addMatch(/(?:^|\/)\.env(?:\..+)?$/i, 2);
    addMatch(/(?:^|\/)package\.json$/i, 1);
    addMatch(/(?:^|\/)index\.html$/i, 2);
    addMatch(/(?:^|\/)README\.md$/i, 1);
    addMatch(/\.(?:tsx|jsx|ts|js|py|vue|svelte)$/i, 6);
    return priority.slice(0, 10);
  }

  function getVibePersona(score) {
    if (score >= 82) return {
      personaKo: '풀오토 AI 오케스트레이터',
      personaEn: 'Full-Auto AI Orchestrator',
      headKo: `순도 ${score}% 하이엔드 바이브코더`,
      headEn: `${score}% Pure Vibe-Coder`,
      sumKo: '프롬프트와 AI 에이전트를 적극 활용해 초고속으로 프로덕트를 찍어내는 전형적인 바이브코딩 패턴이 강하게 나타납니다.',
      sumEn: 'Strong signatures of high-velocity AI-assisted vibe coding: rapid bulk generation, modern AI stack, and agent workflow footprints.',
    };
    if (score >= 58) return {
      personaKo: '하이브리드 AI 페어 코더',
      personaEn: 'Hybrid AI Pair-Coder',
      headKo: `순도 ${score}% 스마트 바이브코더`,
      headEn: `${score}% Hybrid Vibe-Coder`,
      sumKo: '직접 설계와 AI 코드 생성을 균형 있게 섞어 쓰는 실용적 하이브리드 패턴입니다. 생산성과 제어력의 균형이 돋보입니다.',
      sumEn: 'Balanced blend of hand-crafted engineering and AI pair-programming bursts. High shipping velocity with structured edits.',
    };
    if (score >= 32) return {
      personaKo: 'AI 보조 활용 실무 엔지니어',
      personaEn: 'AI-Assisted Pragmatic Engineer',
      headKo: `순도 ${score}% 실무형 코파일럿 유저`,
      headEn: `${score}% AI-Assisted Builder`,
      sumKo: '전통적인 커밋 리듬과 수작업 코드 비중이 높고, 필요한 구간에서만 AI를 보조 도구로 활용한 흔적이 보입니다.',
      sumEn: 'Mostly traditional commit rhythm and hand-written code, with selective AI assistance in boilerplate or UI sections.',
    };
    return {
      personaKo: '순수 수작업 장인 개발자',
      personaEn: 'Bare-Metal Artisan Dev',
      headKo: `순도 ${score}% 순수 수공예 코드`,
      headEn: `${score}% Hand-Crafted Artisan`,
      sumKo: 'AI 특유의 패턴이나 대형 한방 커밋이 거의 발견되지 않았습니다. 직접 타이핑하며 정교하게 쌓아 올린 코드베이스입니다.',
      sumEn: 'Minimal AI footprints or bulk-dump patterns detected. Looks carefully hand-crafted commit by commit.',
    };
  }

  function scoreToGrade(s) {
    if (s >= 94) return 'A+';
    if (s >= 86) return 'A';
    if (s >= 78) return 'B+';
    if (s >= 70) return 'B';
    if (s >= 58) return 'C';
    if (s >= 42) return 'D';
    return 'F';
  }

  function evaluateSourceFiles(files, treePaths, meta, commits, commitStats) {
    const findings = [];

    // ===== STRATEGY A: VIBE-CODING SIGNALS =====
    let burstScore = 10;
    let maxAdditions = 0;
    let avgAdditions = 0;
    let rapidBursts = 0;
    let aiTrailerCount = 0;
    let aiMsgStyleCount = 0;

    if (commitStats.length) {
      const adds = commitStats.map((c) => c.additions || 0);
      maxAdditions = Math.max(...adds);
      avgAdditions = Math.round(adds.reduce((a, b) => a + b, 0) / adds.length);
      if (maxAdditions >= 2500) burstScore += 55;
      else if (maxAdditions >= 1000) burstScore += 42;
      else if (maxAdditions >= 450) burstScore += 26;
      else if (maxAdditions >= 180) burstScore += 12;
      if (avgAdditions >= 600) burstScore += 20;
      else if (avgAdditions >= 250) burstScore += 10;
    }

    for (let i = 0; i < commits.length; i++) {
      const msg = String(commits[i].message || '');
      if (/co-authored-by:.*(?:claude|anthropic|copilot|cursor|gpt|openai|gemini|windsurf|antigravity|aider)/i.test(msg)) aiTrailerCount++;
      if (/^(?:feat|fix|chore|refactor|style|docs)(?:\([^)]+\))?:/i.test(msg) || /[🚀✨🎉🔥⚡💄🐛🔧✅]/.test(msg)) aiMsgStyleCount++;
      if (i > 0 && commits[i - 1].date && commits[i].date) {
        const diffSec = Math.abs(new Date(commits[i - 1].date) - new Date(commits[i].date)) / 1000;
        if (diffSec > 5 && diffSec < 180) rapidBursts++;
      }
    }
    if (rapidBursts >= 4) burstScore += 15;
    else if (rapidBursts >= 2) burstScore += 8;
    burstScore = Math.min(100, burstScore);

    if (maxAdditions >= 600) {
      findings.push({
        category: 'vibe', severity: 'medium',
        titleKo: `단일 커밋 최대 +${maxAdditions.toLocaleString()}줄 대량 생성 감지`,
        titleEn: `Bulk single commit detected (+${maxAdditions.toLocaleString()} lines)`,
        descKo: `최근 커밋 평균 추가 라인 ${avgAdditions.toLocaleString()}줄. 짧은 시간에 수백~수천 줄이 한 번에 생성되는 것은 바이브코딩·AI 코드 생성의 대표적 리듬입니다.`,
        descEn: `Average +${avgAdditions.toLocaleString()} additions per sampled commit. Large multi-hundred line bursts strongly correlate with AI generation.`,
        file: 'git commits',
      });
    }

    // AI footprints in file tree & commit trailers
    const detectedFootprints = [];
    for (const rule of AI_FOOTPRINT_PATHS) {
      const hit = treePaths.find((p) => rule.re.test(p));
      if (hit) detectedFootprints.push({ label: rule.label, path: hit });
    }
    let footprintScore = 0;
    if (detectedFootprints.length) footprintScore += Math.min(75, 45 + (detectedFootprints.length - 1) * 18);
    if (aiTrailerCount > 0) footprintScore += Math.min(45, 25 + aiTrailerCount * 8);
    if (aiMsgStyleCount >= 5) footprintScore += 15;
    footprintScore = Math.min(100, footprintScore);

    if (detectedFootprints.length || aiTrailerCount > 0) {
      findings.push({
        category: 'vibe', severity: 'medium',
        titleKo: `AI 코딩 에이전트 흔적 ${detectedFootprints.length + (aiTrailerCount ? 1 : 0)}건 발견`,
        titleEn: `${detectedFootprints.length + (aiTrailerCount ? 1 : 0)} AI Agent Footprint(s) Detected`,
        descKo: `${detectedFootprints.map((d) => d.label).join(', ')}${aiTrailerCount ? ` · Co-Authored-By AI 커밋 ${aiTrailerCount}건` : ''}`,
        descEn: `${detectedFootprints.map((d) => d.label).join(', ')}${aiTrailerCount ? ` · ${aiTrailerCount} AI Co-Authored commit(s)` : ''}`,
        file: detectedFootprints[0]?.path || 'git log',
      });
    }

    // Source code AI style & stack signals
    let styleHits = 0;
    let emojiHits = 0;
    let stackHits = [];
    let totalLines = 0;
    let consoleLogCount = 0;
    let largestFile = { path: '', lines: 0 };

    // Security & SEO accumulators
    let securityDeduct = 0;
    let qualityDeduct = 0;
    let secretCount = 0;
    let htmlFound = false;
    let seoChecks = { title: false, desc: false, viewport: false, og: false, lang: false, missingAlt: 0 };
    let xssHits = [];
    let evalHits = [];
    let noopenerMissing = 0;

    for (const f of files) {
      const text = f.content || '';
      const lines = text.split('\n').length;
      totalLines += lines;
      if (lines > largestFile.lines) largestFile = { path: f.path, lines };

      // Vibe style heuristics
      const aiCommentMatches = text.match(/\/\/\s*(?:\.\.\.\s*existing|Handle\s|Initialize\s|Helper\s|Step\s+\d|TODO:|Note:|Ensure\s|Render\s|Fetch\s)/gi) || [];
      styleHits += aiCommentMatches.length;
      const em = text.match(/[🚀✨🎯🔥⚡✅❌💡🎨📌🛠️]/g) || [];
      emojiHits += em.length;
      const cl = text.match(/\bconsole\.log\s*\(/g) || [];
      consoleLogCount += cl.length;

      // package.json stack check
      if (/package\.json$/i.test(f.path)) {
        for (const dep of VIBE_DEPS) {
          if (text.includes(`"${dep}`) || text.includes(`'${dep}`)) stackHits.push(dep);
        }
      }

      // Secret scanner (Objective Fact)
      for (const sr of SECRET_RULES) {
        sr.re.lastIndex = 0;
        let m;
        let perFile = 0;
        while ((m = sr.re.exec(text)) && perFile < 2) {
          const val = m[0];
          // Avoid obvious placeholder strings
          if (/your[_-]|example|placeholder|xxxx|12345678|dummy|test_key|sample/i.test(val)) continue;
          perFile++;
          secretCount++;
          securityDeduct += sr.sev === 'critical' ? 28 : 14;
          const ln = lineOfIndex(text, m.index);
          findings.push({
            category: 'security', severity: sr.sev,
            titleKo: `${sr.nameKo}`,
            titleEn: `${sr.nameEn}`,
            descKo: `소스 코드에 키/시크릿 패턴(${maskSecret(val)})이 평문으로 포함되어 있습니다. 공개 저장소라면 즉시 키를 폐기(Revoke)하고 환경변수(.env)로 분리하세요.`,
            descEn: `Plaintext key pattern (${maskSecret(val)}) detected in source. Revoke immediately if active and move to environment variables.`,
            file: `${f.path}:${ln}`,
            fixKo: '즉시 API 키를 재발급하고 .env(서버) 또는 시크릿 볼트로 분리하세요.',
            fixEn: 'Rotate the key immediately and move secrets into server-side environment variables.',
          });
        }
      }

      // XSS / eval checks on JS/TS/HTML (distinguish sanitized/escaped vs raw innerHTML)
      if (/\.(?:html|js|ts|jsx|tsx|vue)$/i.test(f.path)) {
        const xssM = text.match(/dangerouslySetInnerHTML|\.innerHTML\s*=/g) || [];
        const hasSanitizer = /DOMPurify\.sanitize|\besc\s*\(/i.test(text);
        if (xssM.length) xssHits.push({ path: f.path, count: xssM.length, sanitized: hasSanitizer });
        const evalM = text.match(/\beval\s*\(|new\s+Function\s*\(/g) || [];
        if (evalM.length) evalHits.push({ path: f.path, count: evalM.length });
      }

      // SEO checks on index.html / HTML
      if (/\.html?$/i.test(f.path)) {
        htmlFound = true;
        if (/<title[^>]*>[^<]{2,}<\/title>/i.test(text)) seoChecks.title = true;
        if (/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{10,}/i.test(text)) seoChecks.desc = true;
        if (/<meta[^>]+name=["']viewport["']/i.test(text)) seoChecks.viewport = true;
        if (/property=["']og:(?:title|image|description)["']/i.test(text)) seoChecks.og = true;
        if (/<html[^>]+lang=["'][a-z]{2}/i.test(text)) seoChecks.lang = true;
        const imgs = text.match(/<img\b[^>]*>/gi) || [];
        imgs.forEach((im) => { if (!/\balt\s*=/i.test(im)) seoChecks.missingAlt++; });
        const blanks = text.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || [];
        blanks.forEach((a) => { if (!/noopener/i.test(a)) noopenerMissing++; });
      }
    }

    // Tree-level security & hygiene facts
    const exposedEnv = treePaths.filter((p) => /(?:^|\/)\.env(?:\.local|\.production|\.prod)?$/i.test(p) && !/example|sample|template/i.test(p));
    if (exposedEnv.length) {
      securityDeduct += 30;
      findings.push({
        category: 'security', severity: 'critical',
        titleKo: '.env 환경변수 파일이 저장소에 직접 커밋됨',
        titleEn: '.env File Committed Directly to Repository',
        descKo: `민감한 DB 주소·비밀키가 담기기 쉬운 환경변수 파일(${exposedEnv.join(', ')})이 공개 트리에 그대로 올라와 있습니다.`,
        descEn: `Environment file (${exposedEnv.join(', ')}) is tracked in git history, risking credential exposure.`,
        file: exposedEnv[0],
        fixKo: '.gitignore에 .env*를 추가하고 git rm --cached .env 후 모든 키를 교체하세요.',
        fixEn: 'Add .env* to .gitignore, untrack it, and rotate all credentials inside.',
      });
    }

    const exposedKeys = treePaths.filter((p) => /\.(?:pem|key|p12|pfx)$|firebase-adminsdk.*\.json$|id_rsa$/i.test(p));
    if (exposedKeys.length) {
      securityDeduct += 30;
      findings.push({
        category: 'security', severity: 'critical',
        titleKo: '인증서 / 서비스계정 키 파일 노출',
        titleEn: 'Certificate or Service Account Key File Exposed',
        descKo: `보안 키 파일(${exposedKeys.slice(0, 3).join(', ')})이 저장소에 포함되어 있습니다.`,
        descEn: `Private key or admin SDK JSON (${exposedKeys.slice(0, 3).join(', ')}) found in repository tree.`,
        file: exposedKeys[0],
        fixKo: '해당 키 파일을 즉시 폐기하고 저장소에서 완전 삭제하세요.',
        fixEn: 'Revoke credentials immediately and purge the file from git history.',
      });
    }

    if (xssHits.length) {
      const rawHits = xssHits.filter((x) => !x.sanitized);
      const totX = xssHits.reduce((a, b) => a + b.count, 0);
      if (rawHits.length) {
        securityDeduct += Math.min(16, 6 + rawHits.length * 3);
        findings.push({
          category: 'security', severity: 'high',
          titleKo: `이스케이프 미확인 XSS 싱크(innerHTML / dangerouslySetInnerHTML) ${rawHits.reduce((a, b) => a + b.count, 0)}곳`,
          titleEn: `${rawHits.reduce((a, b) => a + b.count, 0)} Unsanitized XSS Sink(s) (innerHTML / dangerouslySetInnerHTML)`,
          descKo: `사용자 입력이나 외부 데이터가 DOMPurify 등의 새니타이저 없이 DOM에 직접 삽입되면 XSS 공격에 노출될 수 있습니다.`,
          descEn: `Direct HTML injection sinks detected without a visible sanitizer across ${rawHits.length} file(s).`,
          file: rawHits.map((x) => `${x.path}(${x.count})`).slice(0, 3).join(', '),
          fixKo: 'textContent 사용을 권장하며, HTML 삽입이 필수라면 DOMPurify로 새니타이즈하세요.',
          fixEn: 'Prefer textContent or sanitize with DOMPurify before rendering HTML.',
        });
      } else {
        findings.push({
          category: 'security', severity: 'pass',
          titleKo: `DOM 삽입 구간(${totX}곳) 이스케이프/새니타이징 적용 확인`,
          titleEn: `HTML Escaping / Sanitizer Detected Around ${totX} DOM Sink(s)`,
          descKo: 'innerHTML 사용 파일에 이스케이프(esc) 또는 DOMPurify 호출이 함께 적용되어 있습니다.',
          descEn: 'Escaping or DOMPurify sanitization is present alongside DOM HTML rendering.',
          file: xssHits.map((x) => x.path).slice(0, 3).join(', '),
        });
      }
    }

    if (evalHits.length) {
      securityDeduct += 10;
      findings.push({
        category: 'security', severity: 'high',
        titleKo: `동적 코드 실행(eval / new Function) ${evalHits.reduce((a, b) => a + b.count, 0)}곳 감지`,
        titleEn: `Dynamic Code Execution (eval / new Function) Detected`,
        descKo: 'eval() 또는 new Function()은 코드 인젝션 위험이 있으며 엄격한 CSP 보안 헤더와 충돌합니다.',
        descEn: 'eval() / new Function() introduces code-injection risk and breaks strict Content-Security-Policy headers.',
        file: evalHits[0].path,
        fixKo: 'JSON.parse 또는 정적 함수 매핑으로 대체하세요.',
        fixEn: 'Replace with JSON.parse or safe lookup maps.',
      });
    }

    if (noopenerMissing > 0) {
      securityDeduct += 4;
      findings.push({
        category: 'security', severity: 'medium',
        titleKo: `target="_blank" 링크 ${noopenerMissing}곳에 rel="noopener" 누락`,
        titleEn: `${noopenerMissing} target="_blank" Link(s) Missing rel="noopener"`,
        descKo: '외부 새 탭 링크에 rel="noopener noreferrer"를 추가하면 탭내빙(Tabnabbing) 위험을 차단할 수 있습니다.',
        descEn: 'Adding rel="noopener noreferrer" prevents reverse tabnabbing on external links.',
        file: 'HTML links',
        fixKo: '모든 target="_blank" 링크에 rel="noopener noreferrer"를 추가하세요.',
        fixEn: 'Add rel="noopener noreferrer" to external target="_blank" links.',
      });
    }

    // Quality & SEO checks
    const hasGitignore = treePaths.some((p) => /(?:^|\/)\.gitignore$/i.test(p));
    const hasReadme = treePaths.some((p) => /(?:^|\/)readme\.md$/i.test(p));
    const hasTests = treePaths.some((p) => /(?:^|\/)(?:tests?|__tests__|spec)\/|\.(?:test|spec)\.[jt]sx?$/i.test(p));
    const hasNodeModules = treePaths.some((p) => /^node_modules\//i.test(p));

    if (hasNodeModules) {
      qualityDeduct += 18;
      findings.push({
        category: 'quality', severity: 'high',
        titleKo: 'node_modules 폴더가 Git에 그대로 커밋됨',
        titleEn: 'node_modules/ Directory Committed to Git',
        descKo: '초보/바이브코딩 프로젝트에서 가장 흔한 실수로, 저장소 용량 폭증과 배포 지연을 유발합니다.',
        descEn: 'Committing node_modules bloats repository size and breaks clean reproducible builds.',
        file: 'node_modules/',
        fixKo: '.gitignore에 node_modules/를 추가하고 추적 해제하세요.',
        fixEn: 'Add node_modules/ to .gitignore and untrack it.',
      });
    }

    if (!hasGitignore && treePaths.length > 0) {
      qualityDeduct += 8;
      findings.push({
        category: 'quality', severity: 'medium',
        titleKo: '.gitignore 파일 누락',
        titleEn: 'Missing .gitignore File',
        descKo: '.gitignore가 없으면 실수로 .env 비밀키나 OS 임시파일이 커밋될 위험이 커집니다.',
        descEn: 'Without .gitignore, secrets (.env) and build artifacts are easily leaked in future commits.',
        file: 'repository root',
        fixKo: '프로젝트 루트에 표준 .gitignore를 추가하세요.',
        fixEn: 'Add a standard .gitignore at the repository root.',
      });
    }

    if (!hasTests && treePaths.length > 4) {
      qualityDeduct += 8;
      findings.push({
        category: 'quality', severity: 'medium',
        titleKo: '자동화 테스트 코드 미발견',
        titleEn: 'No Automated Test Suite Detected',
        descKo: 'AI로 빠르게 생성한 프로젝트일수록 회귀 버그가 잦아 핵심 로직 단위 테스트가 중요합니다.',
        descEn: 'Fast AI-generated codebases benefit greatly from basic smoke/unit tests to prevent regressions.',
        file: 'tests/',
        fixKo: '핵심 기능 3~5개에 대해 Vitest/Jest 또는 Playwright 스모크 테스트를 추가하세요.',
        fixEn: 'Add smoke/unit tests for critical user flows.',
      });
    }

    if (htmlFound) {
      const missingSeo = [];
      if (!seoChecks.title) missingSeo.push('<title>');
      if (!seoChecks.desc) missingSeo.push('meta description');
      if (!seoChecks.viewport) missingSeo.push('meta viewport');
      if (!seoChecks.og) missingSeo.push('OpenGraph (og:title/image)');
      if (!seoChecks.lang) missingSeo.push('<html lang>');
      if (missingSeo.length) {
        qualityDeduct += Math.min(16, missingSeo.length * 4);
        findings.push({
          category: 'quality', severity: missingSeo.length >= 3 ? 'high' : 'medium',
          titleKo: `검색엔진 SEO 기본 태그 ${missingSeo.length}개 누락`,
          titleEn: `${missingSeo.length} Core SEO Meta Tag(s) Missing`,
          descKo: `누락 항목: ${missingSeo.join(', ')}. 구글·네이버 검색 노출과 카카오톡/X 링크 미리보기 클릭률에 직접 영향을 줍니다.`,
          descEn: `Missing: ${missingSeo.join(', ')}. Impacts Google ranking and social card previews.`,
          file: 'index.html',
          fixKo: '<head> 안에 title, description, viewport, og:title, og:image 태그를 채우세요.',
          fixEn: 'Add complete title, meta description, viewport, and OpenGraph tags in <head>.',
        });
      } else {
        findings.push({
          category: 'quality', severity: 'pass',
          titleKo: '핵심 SEO 메타태그·OpenGraph 구성 양호',
          titleEn: 'Core SEO & OpenGraph Meta Tags Present',
          descKo: 'title, description, viewport, OpenGraph, lang 속성이 모두 정상 구성되어 있습니다.',
          descEn: 'title, description, viewport, OpenGraph, and lang attributes are properly configured.',
          file: 'index.html',
        });
      }
      if (seoChecks.missingAlt > 2) {
        qualityDeduct += 4;
        findings.push({
          category: 'quality', severity: 'medium',
          titleKo: `이미지 alt 속성 ${seoChecks.missingAlt}개 누락`,
          titleEn: `${seoChecks.missingAlt} <img> Tag(s) Missing alt Attribute`,
          descKo: '접근성 및 이미지 SEO 점수를 높이기 위해 모든 의미 있는 이미지에 alt 설명을 넣는 것이 좋습니다.',
          descEn: 'Adding descriptive alt attributes improves accessibility and image search indexing.',
          file: 'HTML images',
        });
      }
    }

    if (largestFile.lines > 1400) {
      qualityDeduct += 8;
      findings.push({
        category: 'quality', severity: 'medium',
        titleKo: `초대형 단일 파일 비대화 (${largestFile.lines.toLocaleString()}줄)`,
        titleEn: `Monolithic File Bloat (${largestFile.lines.toLocaleString()} lines)`,
        descKo: `${largestFile.path} 파일이 ${largestFile.lines.toLocaleString()}줄에 달합니다. 바이브코딩을 반복하다 보면 한 파일에 로직이 몰려 유지보수가 어려워집니다.`,
        descEn: `${largestFile.path} has ${largestFile.lines.toLocaleString()} lines. Splitting into focused modules improves maintainability.`,
        file: largestFile.path,
        fixKo: 'UI 컴포넌트·API 클라이언트·유틸 함수를 별도 모듈로 분리하세요.',
        fixEn: 'Refactor into smaller domain modules and components.',
      });
    }

    if (consoleLogCount >= 12) {
      qualityDeduct += 4;
      findings.push({
        category: 'quality', severity: 'medium',
        titleKo: `프로덕션 console.log 디버그 잔존 (${consoleLogCount}건)`,
        titleEn: `${consoleLogCount} console.log Statements Left in Source`,
        descKo: '배포 코드에 디버그 로그가 과도하게 남아 있으면 민감 정보 노출이나 성능 저하의 원인이 됩니다.',
        descEn: 'Excessive console.log statements can leak internal state in production.',
        file: 'source files',
      });
    }

    if (secretCount === 0 && exposedEnv.length === 0 && exposedKeys.length === 0) {
      findings.unshift({
        category: 'security', severity: 'pass',
        titleKo: '주요 API 키·비밀번호·.env 노출 미발견 (안전)',
        titleEn: 'No Exposed API Keys, Secrets, or .env Files Found',
        descKo: `검사한 ${files.length}개 핵심 소스 파일과 전체 파일 트리에서 치명적인 인증키 노출이 발견되지 않았습니다.`,
        descEn: `Scanned ${files.length} source files and full repository tree with zero exposed secret keys.`,
        file: `${files.length} files scanned`,
      });
    }

    // Final Vibe Score calculation (weighted 0-100)
    const styleScore = Math.min(100, Math.round(styleHits * 4.5 + emojiHits * 3.5 + (largestFile.lines > 1200 ? 18 : 0)));
    const uniqueStack = [...new Set(stackHits)];
    const stackScore = Math.min(100, uniqueStack.length * 16 + (meta.language === 'TypeScript' || meta.language === 'HTML' ? 12 : 0));

    if (uniqueStack.length >= 3) {
      findings.push({
        category: 'vibe', severity: 'medium',
        titleKo: `대표 바이브코딩 기술 스택 ${uniqueStack.length}종 조합 감지`,
        titleEn: `${uniqueStack.length} Modern Vibe-Stack Libraries Detected`,
        descKo: `감지 스택: ${uniqueStack.slice(0, 6).join(', ')}`,
        descEn: `Detected stack: ${uniqueStack.slice(0, 6).join(', ')}`,
        file: 'package.json',
      });
    }

    const vibeScore = Math.max(6, Math.min(98, Math.round(
      burstScore * 0.34 +
      footprintScore * 0.30 +
      styleScore * 0.18 +
      stackScore * 0.18
    )));
    const persona = getVibePersona(vibeScore);

    // Final Audit Health Score (0-100)
    const secScore = Math.max(0, 100 - securityDeduct);
    const qualScore = Math.max(0, 100 - qualityDeduct);
    const auditScore = Math.max(12, Math.min(100, Math.round(secScore * 0.62 + qualScore * 0.38)));
    const grade = scoreToGrade(auditScore);

    // Sort findings: critical -> high -> medium -> pass
    const sevRank = { critical: 0, high: 1, medium: 2, pass: 3 };
    findings.sort((a, b) => (sevRank[a.severity] ?? 9) - (sevRank[b.severity] ?? 9));

    const counts = {
      critical: findings.filter((f) => f.severity === 'critical').length,
      high: findings.filter((f) => f.severity === 'high').length,
      medium: findings.filter((f) => f.severity === 'medium').length,
      pass: findings.filter((f) => f.severity === 'pass').length,
    };

    const auditHeadlineKo = counts.critical > 0
      ? `즉시 조치가 필요한 치명 이슈 ${counts.critical}건 발견!`
      : counts.high > 0
        ? `배포 전 점검할 주의 항목 ${counts.high}건 발견`
        : '보안·기본 구조가 매우 깔끔한 상태입니다!';
    const auditHeadlineEn = counts.critical > 0
      ? `${counts.critical} Critical Security Issue(s) Need Immediate Fix!`
      : counts.high > 0
        ? `${counts.high} High-Priority Warning(s) Before Shipping`
        : 'Clean Security & Hygiene Baseline!';

    const auditSummaryKo = counts.critical > 0
      ? 'API 키 노출이나 .env 커밋 등 실제 피해로 이어질 수 있는 치명적 항목이 발견되었습니다. 아래 해결 가이드를 즉시 적용하세요.'
      : `총 ${files.length}개 핵심 파일과 ${treePaths.length}개 경로를 정적 진단했습니다. 기본 보안 상태는 ${grade} 등급(${auditScore}점)입니다.`;
    const auditSummaryEn = counts.critical > 0
      ? 'Critical exposure risks (leaked secrets or .env files) were found. Follow the remediation steps below immediately.'
      : `Audited ${files.length} core files across ${treePaths.length} paths. Overall security & code hygiene grade: ${grade} (${auditScore}/100).`;

    return {
      timestamp: Date.now(),
      repoFullName: meta.fullName,
      repoUrl: meta.htmlUrl || '',
      description: meta.description || '',
      language: meta.language || 'Web',
      stars: meta.stars || 0,
      totalFiles: treePaths.length || files.length,
      totalLinesScanned: totalLines,
      vibe: {
        score: vibeScore,
        ...persona,
        breakdown: [
          { labelKo: '커밋 폭발력 · 대량 생성', labelEn: 'Commit Burst Velocity', score: burstScore },
          { labelKo: 'AI 도구·에이전트 흔적', labelEn: 'AI Agent Footprints', score: footprintScore },
          { labelKo: 'AI 주석·코드 스타일 신호', labelEn: 'AI Code & Comment Style', score: styleScore },
          { labelKo: '바이브코딩 스택 조합', labelEn: 'Vibe-Coding Stack Combo', score: stackScore },
        ],
      },
      audit: {
        score: auditScore,
        grade,
        counts,
        headlineKo: auditHeadlineKo,
        headlineEn: auditHeadlineEn,
        summaryKo: auditSummaryKo,
        summaryEn: auditSummaryEn,
        breakdown: [
          { labelKo: '시크릿·보안 방어력', labelEn: 'Secret & Security Hygiene', score: secScore },
          { labelKo: 'SEO · 구조 · 유지보수성', labelEn: 'SEO, Structure & Quality', score: qualScore },
        ],
      },
      findings,
      commits: commits.slice(0, 8),
      scannedFiles: files.map((f) => ({ path: f.path, lines: (f.content || '').split('\n').length })),
    };
  }

  async function analyzeGitHubRepo(input, { token = '', onStep = () => {} } = {}) {
    const parsed = parseGitHubInput(input);
    if (!parsed) throw new Error('올바른 GitHub 저장소 URL 또는 owner/repo 형식을 입력해 주세요. (예: shadcn-ui/ui)');
    const { owner, repo } = parsed;

    onStep(12, `GET /repos/${owner}/${repo} — 저장소 메타데이터 조회 중…`);
    const repoMeta = await ghJson(`https://api.github.com/repos/${owner}/${repo}`, token);
    const branch = repoMeta.default_branch || 'main';
    onStep(26, `✓ ${repoMeta.full_name} (${repoMeta.language || 'Multi'} · ★${repoMeta.stargazers_count || 0}) 확인`, 'ok');

    onStep(38, `GET /commits — 최근 30개 커밋 리듬·AI 흔적 분석 중…`);
    let rawCommits = [];
    try {
      rawCommits = await ghJson(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`, token);
    } catch { rawCommits = []; }

    const commits = rawCommits.map((c) => ({
      sha: (c.sha || '').slice(0, 7),
      fullSha: c.sha,
      message: (c.commit?.message || '').split('\n')[0],
      fullMessage: c.commit?.message || '',
      date: c.commit?.author?.date || '',
      author: c.commit?.author?.name || 'unknown',
      additions: 0,
      deletions: 0,
    }));

    // Fetch exact additions/deletions for top 3 commits (minimal API calls)
    onStep(52, `Inspecting commit diff sizes (top ${Math.min(3, commits.length)} commits)…`);
    const commitStats = [];
    await Promise.all(commits.slice(0, 3).map(async (c) => {
      try {
        const d = await ghJson(`https://api.github.com/repos/${owner}/${repo}/commits/${c.fullSha}`, token);
        c.additions = d.stats?.additions || 0;
        c.deletions = d.stats?.deletions || 0;
        commitStats.push({ additions: c.additions, deletions: c.deletions });
      } catch {}
    }));

    onStep(66, `GET /git/trees/${branch}?recursive=1 — 전체 파일 트리 및 .env/AI 설정 탐색 중…`);
    let treeItems = [];
    try {
      const tr = await ghJson(`https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`, token);
      treeItems = tr.tree || [];
    } catch { treeItems = []; }
    const treePaths = treeItems.map((t) => t.path);
    const targets = pickFilesToScan(treeItems);
    onStep(78, `Scanning ${targets.length} raw source files (0 API rate cost) for API key leaks & SEO…`, 'ok');

    const files = [];
    await Promise.all(targets.map(async (item) => {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${item.path.split('/').map(encodeURIComponent).join('/')}`;
        const r = await fetch(rawUrl);
        if (r.ok) {
          const content = await r.text();
          files.push({ path: item.path, content });
        }
      } catch {}
    }));

    onStep(94, `Computing Strategy A (Vibe Index) + Strategy B (Security & Quality Audit)…`);
    const report = evaluateSourceFiles(
      files,
      treePaths,
      {
        fullName: repoMeta.full_name,
        htmlUrl: repoMeta.html_url,
        description: repoMeta.description || '',
        language: repoMeta.language || 'Code',
        stars: repoMeta.stargazers_count || 0,
      },
      commits.map((c) => ({ ...c, message: c.fullMessage })),
      commitStats
    );
    // keep clean 1-line commit titles for UI
    report.commits = commits.slice(0, 8);
    onStep(100, `✓ 정적 진단 완료 — Vibe ${report.vibe.score}% · Security Grade ${report.audit.grade} (${report.audit.score}/100)`, 'ok');
    return report;
  }

  function analyzeRawCode(projectName, code, onStep = () => {}) {
    const cleanName = String(projectName || 'pasted-project').trim();
    const isHtml = /<!doctype html|<html[\s>]|<head[\s>]/i.test(code);
    const fname = isHtml ? 'index.html' : 'source.js';
    onStep(45, `100% 로컬 브라우저 정적 분석 중 (${fname})…`);
    const report = evaluateSourceFiles(
      [{ path: fname, content: code }],
      [fname],
      { fullName: cleanName, htmlUrl: '', description: '직접 붙여넣기 정적 코드 진단', language: isHtml ? 'HTML' : 'JS/Code', stars: 0 },
      [{ sha: 'local', message: 'Direct pasted source analysis', date: new Date().toISOString(), additions: code.split('\n').length, deletions: 0 }],
      [{ additions: code.split('\n').length, deletions: 0 }]
    );
    onStep(100, `✓ 코드 정적 분석 완료 — Vibe ${report.vibe.score}% · Grade ${report.audit.grade}`, 'ok');
    return report;
  }

  window.VibeAnalyzer = { analyzeGitHubRepo, analyzeRawCode, parseGitHubInput };
})();
