// buildRuleInfo.js
// Builds a standalone single-page A4 HTML for a RULE_PAGE_* (rule guide page),
// matching the same visual system as your tasks/answers pages:
// - orange header bar with ONLY the rule name
// - crop/guide lines
// - watermark + bottom-right logo
// - content constrained to the inner safe area and auto-shrunk to fit
//
// IMPORTANT (per request): do NOT add any “GoodLang — Вивчення правила” title.

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
 * @param {string} [opts.nunitoRegularB64] - base64 woff2
 * @param {string} [opts.nunitoBoldB64] - base64 woff2
 * @param {string} [opts.nunitoExtraBoldB64] - base64 woff2
 * @param {string} [opts.nunitoItalicB64] - base64 woff2 (optional)
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
        // content cards (kept from the previous RulePage-like styles)
        card: "#fffdf8",
        radius: 18,
        accent: "#ff6138",
        accentDark: "#d74e2a",
        text: "#3a2a1d",
        ...opts.theme,
    };

    const showGuides = opts.showGuides !== false;

    // Header should be the rule name, like on 2nd/3rd page templates.
    const headerRuleName = String(rulePage.headerTitle ?? rulePage.printTitle ?? rulePage.title ?? rulePage.id ?? "")
        .trim();

    // Watermark/logo sources: allow either base64 or direct src.
    const watermarkSrc =
        opts.watermarkSrc ??
        (opts.watermarkBase64 ? `data:image/png;base64,${opts.watermarkBase64}` : "");
    const logoSrc = watermarkSrc

    const fontFaces = [
        opts.nunitoRegularB64
            ? `@font-face{font-family:"Nunito";src:url("data:font/woff2;base64,${opts.nunitoRegularB64}") format("woff2");font-weight:400;font-style:normal;}`
            : "",
        opts.nunitoBoldB64
            ? `@font-face{font-family:"Nunito";src:url("data:font/woff2;base64,${opts.nunitoBoldB64}") format("woff2");font-weight:700;font-style:normal;}`
            : "",
        opts.nunitoExtraBoldB64
            ? `@font-face{font-family:"Nunito";src:url("data:font/woff2;base64,${opts.nunitoExtraBoldB64}") format("woff2");font-weight:800;font-style:normal;}`
            : "",
        opts.nunitoItalicB64
            ? `@font-face{font-family:"Nunito";src:url("data:font/woff2;base64,${opts.nunitoItalicB64}") format("woff2");font-weight:400;font-style:italic;}`
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    // --- Section rendering (same content logic as your previous buildRuleIntroHtml) ---
    const renderMeaning = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        <p class="rp-text">${s.html ?? ""}</p>
      </div>
    </div>
  `;

    const renderUsage = (s) => `
    <div class="rp-block">
      <div class="rp-section-title">${escapeAttr(s.title ?? "")}</div>
      <div class="rp-card">
        <div class="rp-badges">
          ${(s.badges ?? [])
        .map((b) => `<span class="rp-badge">${b ?? ""}</span>`)
        .join("")}
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
                return "";
        }
    };

    const sectionsHtml = (rulePage.sections ?? []).map(renderSection).filter(Boolean).join("\n");

    // --- CSS: aligned to your templates' layout system (sheet + guides + header + watermark/logo) ---
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
    }

    *{ box-sizing: border-box; }
    html, body{ margin:0; padding:0; }

    body{
      margin:0;
      background:#efefef;
      font-family: ${opts.nunitoRegularB64 ? '"Nunito",' : ""} system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
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
    .guides{ position:absolute; inset:0; pointer-events:none; opacity: 0.95; display:${showGuides ? "block" : "none"}; }
    .guide{ position:absolute; background: var(--orange); }
    .g-top    { left:0; right:0; top:  28px; height: 3px; }
    .g-bottom { left:0; right:0; bottom:28px; height: 3px; }
    .g-left   { top:0; bottom:0; left: 28px; width: 3px; }
    .g-right  { top:0; bottom:0; right:28px; width: 3px; }

    /* ---------- Watermark (image-based, like templates) ---------- */
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
      z-index: 3;
    }
    .watermark img{ width:100%; height:100%; object-fit: contain; }

    /* ---------- Content ---------- */
    .content{
      position:absolute;
      inset:0;
      padding: var(--padTop) var(--padX) var(--padBottom);
      display:flex;
      flex-direction:column;
      gap: 14px;
      z-index: 2;
    }

    /* Header bar should match tasks pages; only rule name inside */
    .header{
      background: var(--orange);
      height: 74px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      position: relative;
      left: -18px;
      top: -18px;
      width: 710px;
      flex: 0 0 auto;
    }
    .header h1{
      margin: 0;
      color: #fff;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: clamp(18px, 3vw, 46px);
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
    }
    .rule-fit-inner{
      transform-origin: top left;
      width: 100%;
    }

    /* ---------- Bottom-right logo ---------- */
    .logo{
      position: absolute;
      right: 44px;
      bottom: 4px;
      width: 60px;
      height: 60px;
      border-radius: 999px;
      overflow: hidden;
      background: transparent;
      z-index: 2;
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

    /* ---------- Rule content (kept from previous buildRuleIntroHtml) ---------- */
    .rp-section-title{
      margin: 10px 2px 8px;
      font-size: 12px;
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
      padding: 14px;
      break-inside: avoid;
    }

    .rp-text{ margin: 0; font-size: 13.5px; line-height: 1.45; color: ${theme.text}; }
    .rp-hint{ margin-top: 8px; color: ${theme.muted}; font-size: 12px; line-height: 1.4; }

    .rp-badges{ display:flex; gap:8px; flex-wrap:wrap; }
    .rp-badge{
      display:inline-flex;
      align-items:center;
      gap:6px;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 999px;
      border: 2px solid ${theme.accent};
      background: transparent;
      color: ${theme.text};
    }

    .rp-table-wrap{ width:100%; overflow:hidden; }
    .rp-table{ width:100%; border-collapse:collapse; margin-top:6px; font-size:12.5px; line-height:1.35; }
    .rp-table th, .rp-table td{ padding:8px 8px; vertical-align:top; border-bottom:1px solid rgba(0,0,0,.12); word-break: break-word; }
    .rp-table th{
      text-transform: uppercase;
      font-size: 10.5px;
      letter-spacing: .06em;
      color: ${theme.muted};
      text-align:left;
      border-bottom: 2px solid ${theme.accent};
    }

    .rp-example{
      background:#fff;
      border:2px solid ${theme.accent};
      border-radius:14px;
      padding:10px;
      margin:6px 0;
    }
    .rp-example-en{ font-weight:700; }
    .rp-example-ua{ color:${theme.muted}; margin-top:2px; }

    .rp-ul{ margin:6px 0 0; padding-left:18px; }
    .rp-ul li{ margin:6px 0; }
    .rp-note{
      margin-top:8px;
      padding:10px 12px;
      border-left:4px solid ${theme.accent};
      background:#fff;
      border-radius:10px;
      color:${theme.muted};
      font-size:12px;
      line-height:1.4;
    }

    .rp-block{ margin-bottom: 12px; }
    .rp-card, .rp-example, table, tr { break-inside: avoid; page-break-inside: avoid; }

    /* Ensure long content wraps instead of pushing width */
    pre, code{ white-space: pre-wrap; word-break: break-word; }
  `.trim();

    // Auto-fit script: shrink rule content to stay inside the safe area.
    // (Single page intro; we clamp minimum scale so it doesn't become unreadable.)
    const fitScript = `
    (function(){
      const outer = document.getElementById('ruleFitOuter');
      const inner = document.getElementById('ruleFitInner');
      if(!outer || !inner) return;

      function fit(){
        inner.style.transform = 'scale(1)';
        // Force layout
        const outerRect = outer.getBoundingClientRect();
        const innerW = inner.scrollWidth;
        const innerH = inner.scrollHeight;

        const wRatio = outerRect.width / Math.max(1, innerW);
        const hRatio = outerRect.height / Math.max(1, innerH);
        const scale = Math.min(1, wRatio, hRatio);
        const clamped = Math.max(scale, 0.72);
        inner.style.transform = 'scale(' + clamped.toFixed(4) + ')';
      }

      window.addEventListener('load', () => {
        fit();
        setTimeout(fit, 60);
        setTimeout(fit, 240);
      });
    })();
  `.trim();

    // Note: rule strings may contain inline HTML (strong/em/u), we keep them as-is.
    return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeAttr(headerRuleName || rulePage.id || "Rule")}</title>
  <style>
${fontFaces}
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

    ${watermarkSrc ? `
      <div class="watermark" aria-hidden="true">
        <img src="${escapeAttr(watermarkSrc)}" alt="" />
      </div>
    ` : ""}

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

    ${logoSrc ? `
      <div class="logo" aria-hidden="true">
        <img src="${escapeAttr(logoSrc)}" alt="" />
      </div>
    ` : ""}

  </div>

  <script>
    ${fitScript}
  </script>
</body>
</html>`;
}
