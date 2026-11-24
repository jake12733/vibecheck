/* VIBECHECK · 1200x630 High-DPI Viral OG Result Card Renderer */
(function () {
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function renderShareCard(canvas, report, lang) {
    if (!canvas || !report) return;
    const ctx = canvas.getContext('2d');
    const W = 1200, H = 630;
    canvas.width = W;
    canvas.height = H;
    const isEn = lang === 'en';

    // Dark luxury obsidian background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#07090f');
    bg.addColorStop(0.55, '#0e1422');
    bg.addColorStop(1, '#090b12');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial auras
    const g1 = ctx.createRadialGradient(250, 140, 20, 250, 140, 420);
    g1.addColorStop(0, 'rgba(139,92,246,0.22)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(960, 480, 20, 960, 480, 420);
    g2.addColorStop(0, 'rgba(0,229,160,0.18)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // Subtle dot grid
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let gx = 40; gx < W; gx += 40) {
      for (let gy = 40; gy < H; gy += 40) {
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }
    }

    // Outer border frame
    roundRect(ctx, 24, 24, W - 48, H - 48, 26);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Header brand badge
    roundRect(ctx, 56, 54, 42, 42, 11);
    const bm = ctx.createLinearGradient(56, 54, 98, 96);
    bm.addColorStop(0, '#00e5a0');
    bm.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = bm;
    ctx.fill();
    ctx.fillStyle = '#04120d';
    ctx.font = '800 18px Inter, Pretendard, sans-serif';
    ctx.fillText('VC', 65, 81);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 22px Inter, Pretendard, sans-serif';
    ctx.fillText('VIBECHECK', 112, 82);

    ctx.fillStyle = '#8b97ad';
    ctx.font = '600 14px JetBrains Mono, monospace';
    ctx.fillText(isEn ? 'VIBE-CODING INDEX & SECURITY AUDIT' : '바이브코딩 지수 & 보안·품질 건강검진 리포트', 258, 81);

    // Repo name top-right pill
    const repoTxt = String(report.repoFullName || 'project').slice(0, 34);
    ctx.font = '600 16px JetBrains Mono, monospace';
    const rw = Math.min(420, ctx.measureText(repoTxt).width + 36);
    roundRect(ctx, W - 56 - rw, 54, rw, 42, 21);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#00e5a0';
    ctx.fillText(repoTxt, W - 56 - rw + 18, 80);

    // Left Card: Strategy A (Vibe-Coding Index)
    roundRect(ctx, 56, 126, 526, 360, 22);
    ctx.fillStyle = 'rgba(18,23,35,0.92)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(167,139,250,0.34)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = '#a78bfa';
    ctx.font = '700 14px JetBrains Mono, monospace';
    ctx.fillText(isEn ? '01 · VIBE-CODING PURITY INDEX' : '01 · 바이브코딩 순도 지수', 88, 168);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 84px Inter, Pretendard, sans-serif';
    ctx.fillText(`${report.vibe.score}%`, 84, 266);

    // Persona pill
    const personaTxt = isEn ? report.vibe.personaEn : report.vibe.personaKo;
    ctx.font = '700 18px Pretendard, Inter, sans-serif';
    const pw = Math.min(460, ctx.measureText(personaTxt).width + 28);
    roundRect(ctx, 84, 290, pw, 38, 10);
    ctx.fillStyle = 'rgba(139,92,246,0.22)';
    ctx.fill();
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText(personaTxt, 98, 315);

    // Vibe sub-metrics
    ctx.font = '500 15px Pretendard, Inter, sans-serif';
    report.vibe.breakdown.slice(0, 3).forEach((b, i) => {
      const y = 368 + i * 36;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(isEn ? b.labelEn : b.labelKo, 86, y);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 15px JetBrains Mono, monospace';
      ctx.fillText(`${b.score}/100`, 470, y);
      ctx.font = '500 15px Pretendard, Inter, sans-serif';
      roundRect(ctx, 86, y + 8, 460, 6, 3);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();
      roundRect(ctx, 86, y + 8, Math.max(8, 460 * (b.score / 100)), 6, 3);
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();
    });

    // Right Card: Strategy B (Security & Quality Health)
    roundRect(ctx, 616, 126, 528, 360, 22);
    ctx.fillStyle = 'rgba(18,23,35,0.92)';
    ctx.fill();
    const gradeColor = report.audit.score >= 85 ? '#00e5a0' : report.audit.score >= 65 ? '#f59e0b' : '#f43f5e';
    ctx.strokeStyle = gradeColor + '66';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = gradeColor;
    ctx.font = '700 14px JetBrains Mono, monospace';
    ctx.fillText(isEn ? '02 · SECURITY & QUALITY HEALTH' : '02 · 보안 · 코드 품질 건강검진', 648, 168);

    ctx.fillStyle = gradeColor;
    ctx.font = '800 84px Inter, Pretendard, sans-serif';
    ctx.fillText(report.audit.grade, 646, 266);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 28px JetBrains Mono, monospace';
    ctx.fillText(`${report.audit.score} / 100`, 764, 246);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px Pretendard, Inter, sans-serif';
    const statLine = isEn
      ? `Critical ${report.audit.counts.critical} · Warnings ${report.audit.counts.high} · Passed ${report.audit.counts.pass}`
      : `치명 ${report.audit.counts.critical}건 · 주의 ${report.audit.counts.high}건 · 통과 ${report.audit.counts.pass}건`;
    ctx.fillText(statLine, 764, 276);

    // Key findings bullets
    const topFindings = report.findings.filter((f) => f.category !== 'vibe').slice(0, 4);
    topFindings.forEach((f, i) => {
      const y = 330 + i * 36;
      const c = f.severity === 'critical' ? '#f43f5e' : f.severity === 'high' ? '#f59e0b' : '#00e5a0';
      roundRect(ctx, 648, y - 15, 76, 22, 6);
      ctx.fillStyle = c + '28';
      ctx.fill();
      ctx.fillStyle = c;
      ctx.font = '700 11px JetBrains Mono, monospace';
      ctx.fillText(f.severity.toUpperCase().slice(0, 8), 656, y);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 14.5px Pretendard, Inter, sans-serif';
      const title = (isEn ? f.titleEn : f.titleKo).slice(0, 34);
      ctx.fillText(title, 736, y);
    });

    // Footer bar
    ctx.fillStyle = '#64748b';
    ctx.font = '600 14px JetBrains Mono, monospace';
    const siteUrl = (typeof location !== 'undefined' && location.origin && location.origin !== 'null')
      ? (location.origin + location.pathname).replace(/\/$/, '')
      : 'https://jake12733.github.io/vibecheck';
    ctx.fillText(`SCANNED FREE IN BROWSER · ${siteUrl}`, 56, 560);

    ctx.fillStyle = '#00e5a0';
    ctx.font = '700 15px Pretendard, Inter, sans-serif';
    const ctaTxt = isEn ? 'Check your repo free →' : '내 프로젝트도 10초 무료 진단하기 →';
    const cw = ctx.measureText(ctaTxt).width;
    ctx.fillText(ctaTxt, W - 56 - cw, 560);
  }

  window.VibeShareCard = { renderShareCard };
})();
