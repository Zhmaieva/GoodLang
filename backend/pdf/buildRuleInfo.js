// buildRuleInfo.js
// Builds a standalone single-page A4 HTML for a RULE_PAGE_* (rule guide page),
// matching the same visual system as your tasks/answers pages:
// - orange header bar with ONLY the rule name
// - crop/guide lines
// - watermark + bottom-right logo
// - content constrained to the inner safe area and auto-shrunk to fit
//
// IMPORTANT (per request): do NOT add any “GoodLang — Вивчення правила” title.
import {FONT_FAMILY_CSS} from "../../shared/fontFamily.js";

function escapeAttr(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

/**
 * @param {object} rulePage - like RULE_PAGE_TO_BE
 * @param {object} opts
 * @param {object} [opts.theme] - optional theme override
 *
 * Watermark + logo (choose one approach):
 * @param {string} [opts.watermarkBase64] - base64 PNG (no prefix)
 * @param {string} [opts.watermarkSrc] - e.g. file:///... or https://... or data:image/png;base64,...
 *
 * Guides:
 * @param {boolean} [opts.showGuides=true]
 */
export function buildRuleIntroHtml(rulePage, opts = {}) {
    if (!rulePage || !rulePage.sections) {
        throw new Error("buildRuleIntroHtml: invalid rule page data");
    }

    const theme = {
        orange: "#FE6136",
        orangeDark: "#f64c2a",
        ink: "#2b2b2b",
        muted: "#666",
        paper: "#ffffff",
        // content cards
        card: "#fffdf8",
        radius: 18,
        accent: "#ff6138",
        accentDark: "#d74e2a",
        text: "#3a2a1d",
        ...opts.theme,
    };

    const showGuides = opts.showGuides !== false;

    // Header should be the rule name, like on 2nd/3rd page templates.
    const headerRuleName = String(
        rulePage.headerTitle ?? rulePage.printTitle ?? rulePage.title ?? rulePage.id ?? ""
    ).trim();

    // Watermark/logo sources: allow either base64 or direct src.
    const watermarkSrc =
        opts.watermarkSrc ??
        (opts.watermarkBase64 ? `data:image/png;base64,${opts.watermarkBase64}` : "");
    const logoSrc = watermarkSrc;

    /** -------- Section rendering --------
     * IMPORTANT: use a "rich" container instead of forcing <p class="rp-text">
     * so rulePage.html can contain <p>, <ul>, etc. without nesting issues.
     */
    const renderMeaning = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        <div class="rp-rich">${s.html ?? ""}</div>
      </div>
    </div>
  `;

    const renderUsage = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        <div class="rp-badges">
          ${(s.badges ?? []).map((b) => `<span class="rp-badge">${b ?? ""}</span>`).join("")}
        </div>
        ${s.hint ? `<div class="rp-hint">${s.hint}</div>` : ""}
      </div>
    </div>
  `;

    const renderForms = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        <div class="rp-table-wrap">
          <table class="rp-table" aria-label="Forms table">
            ${
        (s.headers?.length ?? 0) > 0
            ? `<thead><tr>${s.headers.map((h) => `<th>${escapeAttr(h)}</th>`).join("")}</tr></thead>`
            : ""
    }
            <tbody>
              ${(s.rows ?? [])
        .map(
            (row) =>
                `<tr>${(row ?? []).map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`
        )
        .join("")}
            </tbody>
          </table>
        </div>
        ${s.hint ? `<div class="rp-hint">${s.hint}</div>` : ""}
      </div>
    </div>
  `;

    const renderExamples = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        ${(s.items ?? [])
        .map(([enText, uaText]) => {
            return `
              <div class="rp-example">
                <div class="rp-example-en">${escapeAttr(enText)}</div>
                <div class="rp-example-ua">${escapeAttr(uaText)}</div>
              </div>
            `;
        })
        .join("")}
      </div>
    </div>
  `;

    const renderMistakes = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        <ul class="rp-ul">
          ${(s.bullets ?? []).map((b) => `<li>${b ?? ""}</li>`).join("")}
        </ul>
        ${s.note ? `<div class="rp-note">${s.note}</div>` : ""}
      </div>
    </div>
  `;

    const renderSection = (section) => {
        if (!section || section.type === "trainer") return ""; // omit trainer
        switch (section.type) {
            case "meaning":
                return renderMeaning(section);
            case "usage":
                return renderUsage(section);
            case "forms":
                return renderForms(section);
            case "examples":
                return renderExamples(section);
            case "mistakes":
                return renderMistakes(section);
            default:
                if (section?.html) {
                    return `
            <div class="rp-block">
              <div class="rp-section-title">${escapeAttr(section.title ?? "")}</div>
              <div class="rp-card">
                <div class="rp-rich">${section.html ?? ""}</div>
              </div>
            </div>
          `;
                }
                return "";
        }
    };

    const sectionsHtml = (rulePage.sections ?? []).map(renderSection).filter(Boolean).join("\n");

    const css = `
    /* ---------- Print setup ---------- */
    @page { size: A4; margin: 0; }

    :root{
      --orange: ${theme.orange};
      --orange-dark: ${theme.orangeDark};
      --ink: ${theme.ink};
      --muted: ${theme.muted};
      --paper: ${theme.paper};

      /* Inner content padding to mimic tasks layout */
      --padX: 48px;
      --padTop: 48px;
      --padBottom: 46px;

      /* reserve space so content never collides with the logo */
      --logoSafe: 86px;

      /* compact tuning (applied when .sheet.compact is set) */
      --compactPad: 10px;
      --compactGap: 8px;
      --compactCardPad: 10px;
      --compactTitleMB: 6px;
      --compactBlockMB: 8px;
    }

    *{ box-sizing: border-box; }
    html, body{ margin:0; padding:0; }

    body{
      margin:0;
      background:#efefef;
      font-family: ${FONT_FAMILY_CSS};
      color: var(--ink);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @media screen {
      body{ display:flex; justify-content:center; padding:24px; }
    }

    /* A4 at ~96dpi preview. Print will still be A4 via @page. */
    .sheet{
      width: 794px;
      height: 1123px;
      background: var(--paper);
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,.15);
    }

    /* ---------- Guides (same as templates) ---------- */
    .guides{ position:absolute; inset:0; pointer-events:none; opacity: 0.95; display:${showGuides ? "block" : "none"}; z-index: 10; }
    .guide{ position:absolute; background: var(--orange); }
    .g-top    { left:0; right:0; top:  28px; height: 3px; }
    .g-bottom { left:0; right:0; bottom:28px; height: 3px; }
    .g-left   { top:0; bottom:0; left: 28px; width: 3px; }
    .g-right  { top:0; bottom:0; right:28px; width: 3px; }

    /* ---------- Watermark ---------- */
    .watermark{
      position:absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      width: 360px;
      height: 360px;
      opacity: 0.10;
      pointer-events:none;
      user-select:none;
      z-index: 1;
    }
    .watermark img{ width:100%; height:100%; object-fit: contain; }

    /* ---------- Content ---------- */
    .content{
      position:absolute;
      inset:0;
      padding: var(--padTop) var(--padX) var(--padBottom);
      display:flex;
      flex-direction:column;
      gap: 12px;
      z-index: 3;
    }

    /* Header bar: only rule name inside */
    .header{
      background: var(--orange);
      height: 74px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      position: relative;
      left: -18px;
      top: -18px;
      width: 734px;
      flex: 0 0 auto;
      z-index: 4;
    }
    .header h1{
      margin: 0;
      color: #fff;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: clamp(20px, 3.1vw, 44px);
      letter-spacing: .2px;
      text-transform: lowercase;
      width: 100%;
    }

    /* The printable content area under the header (auto-fit) */
    .rule-fit-outer{
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
      position: relative;

      /* reserve bottom space for logo so text never overlaps it */
      padding-bottom: var(--logoSafe);
    }

    .rule-fit-inner{
      width: 99%;
      transform-origin: top left;
      --k: 1;
    }

    /* ---------- Bottom-right logo ---------- */
    .logo{
      position: absolute;
      right: 44px;
      bottom: 24px;
      width: 60px;
      height: 60px;
      border-radius: 999px;
      overflow: hidden;
      background: transparent;
      z-index: 5;
    }
    .logo img{ width:100%; height:100%; object-fit: contain; }

    /* ---------- Print friendliness ---------- */
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        background: #fff !important;
      }
      body { display: block !important; }
      .sheet {
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        box-shadow: none !important;
        overflow: hidden !important;
      }
    }

    /* ---------- Rule content (scaled by --k) ---------- */

    .rp-section-title{
      margin: calc(10px * var(--k)) calc(2px * var(--k)) calc(8px * var(--k));
      font-size: calc(12px * var(--k));
      letter-spacing: .06em;
      text-transform: uppercase;
      font-weight: 800;
      color: ${theme.muted};
    }

    .rp-card{
      background: ${theme.card};
      border: 3px solid ${theme.accent};
      border-radius: ${theme.radius}px;
      box-shadow: 4px 4px 0 ${theme.accentDark};
      padding: calc(14px * var(--k));
      break-inside: avoid;
    }

    /* Rich text defaults (avoid huge margins from nested <p>) */
    .rp-rich{
      font-size: calc(13.5px * var(--k));
      line-height: 1.45;
      color: ${theme.text};
    }
    .rp-rich p{ margin: 0 0 calc(8px * var(--k)); }
    .rp-rich p:last-child{ margin-bottom: 0; }
    .rp-rich ul{ margin: calc(6px * var(--k)) 0 0; padding-left: calc(18px * var(--k)); }
    .rp-rich li{ margin: calc(6px * var(--k)) 0; }

    .rp-hint{ margin-top: calc(8px * var(--k)); color: ${theme.muted}; font-size: calc(12px * var(--k)); line-height: 1.4; }

    .rp-badges{ display:flex; gap: calc(8px * var(--k)); flex-wrap:wrap; }
    .rp-badge{
      display:inline-flex;
      align-items:center;
      gap: calc(6px * var(--k));
      font-size: calc(13px * var(--k));
      font-weight: 700;
      padding: calc(6px * var(--k)) calc(10px * var(--k));
      border-radius: 999px;
      border: 2px solid ${theme.accent};
      background: transparent;
      color: ${theme.text};
    }

    .rp-table-wrap{ width:100%; overflow:hidden; }
    .rp-table{ width:100%; border-collapse:collapse; margin-top: calc(6px * var(--k)); font-size: calc(12.5px * var(--k)); line-height:1.35; }
    .rp-table th, .rp-table td{ padding: calc(8px * var(--k)); vertical-align:top; border-bottom:1px solid rgba(0,0,0,.12); word-break: break-word; }
    .rp-table th{
      text-transform: uppercase;
      font-size: calc(10.5px * var(--k));
      letter-spacing: .06em;
      color: ${theme.muted};
      text-align:left;
      border-bottom: 2px solid ${theme.accent};
    }

    .rp-example{
      background:#fff;
      border:2px solid ${theme.accent};
      border-radius:14px;
      padding: calc(10px * var(--k));
      margin: calc(6px * var(--k)) 0;
    }
    .rp-example-en{ font-weight:700; font-size: calc(13px * var(--k)); }
    .rp-example-ua{ color:${theme.muted}; margin-top: calc(2px * var(--k)); font-size: calc(12px * var(--k)); }

    .rp-ul{ margin: calc(6px * var(--k)) 0 0; padding-left: calc(18px * var(--k)); }
    .rp-ul li{ margin: calc(6px * var(--k)) 0; font-size: calc(13px * var(--k)); }

    .rp-note{
      margin-top: calc(8px * var(--k));
      padding: calc(10px * var(--k)) calc(12px * var(--k));
      border-left:4px solid ${theme.accent};
      background:#fff;
      border-radius:10px;
      color:${theme.muted};
      font-size: calc(12px * var(--k));
      line-height:1.4;
    }

    .rp-block{ margin-bottom: calc(10px * var(--k)); }
    .rp-card, .rp-example, table, tr { break-inside: avoid; page-break-inside: avoid; }

    /* Ensure long content wraps instead of pushing width */
    pre, code{ white-space: pre-wrap; word-break: break-word; }

    /* ---------------- Compact mode (auto-enabled by JS when needed) ---------------- */
    .sheet.compact .content{
      gap: var(--compactGap);
    }
    .sheet.compact .rp-section-title{
      margin: calc(8px * var(--k)) 2px calc(var(--compactTitleMB) * var(--k));
      font-size: calc(11px * var(--k));
    }
    .sheet.compact .rp-block{
      margin-bottom: calc(var(--compactBlockMB) * var(--k));
    }
    .sheet.compact .rp-card{
      padding: calc(var(--compactCardPad) * var(--k));
      border-width: 2px;
      box-shadow: 3px 3px 0 ${theme.accentDark};
    }
    .sheet.compact .rp-rich{
      font-size: calc(12.6px * var(--k));
      line-height: 1.38;
    }
    .sheet.compact .rp-rich p{ margin: 0 0 calc(6px * var(--k)); }
    .sheet.compact .rp-rich li{ margin: calc(4px * var(--k)) 0; }

    .sheet.compact .rp-badges{ gap: calc(6px * var(--k)); }
    .sheet.compact .rp-badge{
      font-size: calc(12px * var(--k));
      padding: calc(4px * var(--k)) calc(8px * var(--k));
      border-width: 1.5px;
    }

    .sheet.compact .rp-example{
      padding: calc(8px * var(--k));
      border-width: 1.5px;
      margin: calc(5px * var(--k)) 0;
    }
    .sheet.compact .rp-example-en{ font-size: calc(12.5px * var(--k)); }
    .sheet.compact .rp-example-ua{ font-size: calc(11.5px * var(--k)); }

    .sheet.compact .rp-table{ font-size: calc(12px * var(--k)); }
    .sheet.compact .rp-table th, .sheet.compact .rp-table td{ padding: calc(6px * var(--k)); }

    .sheet.compact .rp-ul li{ font-size: calc(12.5px * var(--k)); margin: calc(4px * var(--k)) 0; }
    .sheet.compact .rp-hint{ font-size: calc(11.5px * var(--k)); margin-top: calc(6px * var(--k)); }
  `.trim();

    // More robust auto-fit:
    // - binary search --k down to 0.50
    // - compact mode toggle when needed
    // - refit after fonts load
    // - refit on resize via ResizeObserver
    const fitScript = `
    (function(){
      const sheet = document.querySelector('.sheet');
      const outer = document.getElementById('ruleFitOuter');
      const inner = document.getElementById('ruleFitInner');
      if(!outer || !inner || !sheet) return;

      const MIN_K = 0.50; // a bit lower for edge cases
      const MAX_K = 1.00;

      function setK(k){
        inner.style.setProperty('--k', String(k));
      }

      function rectFits(){
        // Use bounding rects to avoid scrollHeight quirks in print rendering
        const o = outer.getBoundingClientRect();
        const i = inner.getBoundingClientRect();
        // tolerate a tiny overflow due to rounding
        return (i.width <= o.width + 1.5) && (i.height <= o.height + 1.5);
      }

      async function raf(){
        return new Promise(r => requestAnimationFrame(() => r()));
      }

      function setCompact(on){
        if(on) sheet.classList.add('compact');
        else sheet.classList.remove('compact');
      }

      async function fitPass(){
        // reset state
        inner.style.transform = 'none';
        setCompact(false);
        setK(MAX_K);
        await raf();

        // First try without compact
        if(rectFits()) return { k: MAX_K, compact: false };

        // Binary search for best k
        let lo = MIN_K, hi = MAX_K;
        for(let i=0;i<22;i++){
          const mid = (lo + hi) / 2;
          setK(mid);
          await raf();
          if(rectFits()) lo = mid;
          else hi = mid;
        }
        setK(lo);
        await raf();

        if(rectFits()) {
          // If we had to shrink a lot, enable compact and retry at slightly higher k
          if(lo < 0.78){
            setCompact(true);
            await raf();
            // Try to reclaim size with compact mode
            let lo2 = MIN_K, hi2 = MAX_K;
            setK(MAX_K);
            await raf();
            if(!rectFits()){
              for(let i=0;i<22;i++){
                const mid = (lo2 + hi2) / 2;
                setK(mid);
                await raf();
                if(rectFits()) lo2 = mid;
                else hi2 = mid;
              }
              setK(lo2);
              await raf();
            }
            return { k: parseFloat(inner.style.getPropertyValue('--k') || String(lo2)), compact: true };
          }
          return { k: lo, compact: false };
        }

        // If still not fitting: enable compact and binary search again
        setCompact(true);
        setK(MAX_K);
        await raf();

        if(rectFits()) return { k: MAX_K, compact: true };

        let lo3 = MIN_K, hi3 = MAX_K;
        for(let i=0;i<24;i++){
          const mid = (lo3 + hi3) / 2;
          setK(mid);
          await raf();
          if(rectFits()) lo3 = mid;
          else hi3 = mid;
        }
        setK(lo3);
        await raf();

        // Last resort: tiny transform scale steps
        if(!rectFits()){
          inner.style.transformOrigin = 'top left';
          inner.style.transform = 'scale(0.94)';
          await raf();
          if(!rectFits()){
            inner.style.transform = 'scale(0.92)';
            await raf();
          }
          if(!rectFits()){
            inner.style.transform = 'scale(0.90)';
            await raf();
          }
        }

        return { k: parseFloat(inner.style.getPropertyValue('--k') || String(lo3)), compact: true };
      }

      function scheduleFit(){
        clearTimeout(window.__ruleFitT);
        window.__ruleFitT = setTimeout(() => { fitPass(); }, 30);
      }

      window.addEventListener('load', () => {
        fitPass();
        setTimeout(fitPass, 80);
        setTimeout(fitPass, 260);
      });

      if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(() => {
          scheduleFit();
          setTimeout(fitPass, 80);
        }).catch(() => {});
      }

      try{
        const ro = new ResizeObserver(() => scheduleFit());
        ro.observe(outer);
        ro.observe(inner);
      }catch(e){ /* ignore */ }
    })();
  `.trim();

    return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeAttr(headerRuleName || rulePage.id || "Rule")}</title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="sheet">

    <div class="guides" aria-hidden="true">
      <div class="guide g-top"></div>
      <div class="guide g-bottom"></div>
      <div class="guide g-left"></div>
      <div class="guide g-right"></div>
    </div>

    ${
        watermarkSrc && opts.withWatermarks
            ? `
      <div class="watermark" aria-hidden="true">
        <img src="${escapeAttr(watermarkSrc)}" alt="" />
      </div>
    `
            : ""
    }

    <div class="content">
      <div class="header">
        <h1>${escapeAttr(headerRuleName)}</h1>
      </div>

      <div class="rule-fit-outer" id="ruleFitOuter">
        <div class="rule-fit-inner" id="ruleFitInner">
          ${sectionsHtml}
        </div>
      </div>
    </div>

    ${
        logoSrc && opts.withWatermarks
            ? `
      <div class="logo" aria-hidden="true">
        <img src="${escapeAttr(logoSrc)}" alt="" />
      </div>
    `
            : ""
    }

  </div>

  <script>
    ${fitScript}
  </script>
</body>
</html>`;
}
