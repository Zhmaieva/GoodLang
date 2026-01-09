// buildRuleIntroHtml.js
// Builds a standalone HTML document (A4) for a rule page, suitable for Puppeteer printing.
// Omits: trainer section + any footer.

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
 * @param {object} [opts.theme] - optional theme override (colors, radius, etc.)
 * @param {string} [opts.brandTitle] - e.g. "GoodLang"
 * @param {string} [opts.nunitoRegularB64] - optional base64 woff2 for Nunito Regular
 * @param {string} [opts.nunitoBoldB64] - optional base64 woff2 for Nunito Bold
 * @param {string} [opts.nunitoExtraBoldB64] - optional base64 woff2 for Nunito ExtraBold
 */
export function buildRuleIntroHtml(rulePage, opts = {}) {
    if (!rulePage || !rulePage.sections) {
        throw new Error("buildRuleIntroHtml: invalid rule page data");
    }

    const theme = {
        accent: "#ff6138",
        accentDark: "#d74e2a",
        text: "#3a2a1d",
        muted: "#7b5a42",
        card: "#fffdf8",
        radius: 18,
        good: "#4ba36e",
        greenDark: "#2f7d4c",
        warn: "#ffd36a",
        bad: "#ff5a7a",
        ...opts.theme,
    };

    const brandTitle = opts.brandTitle ?? "GoodLang";

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
    ]
        .filter(Boolean)
        .join("\n");

    const css = `
@page { size: A4; margin: 14mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: ${opts.nunitoRegularB64 ? '"Nunito",' : ""} system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: ${theme.text};
  background: #fff;
}

/* Layout */
.rp-wrap { width: 100%; }
.rp-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 10px 0;
}
.rp-brand {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: .02em;
}
.rp-title {
  font-weight: 800;
  font-size: 18px;
  text-align: right;
  color: ${theme.muted};
}

/* Section title (uppercase, like RulePage) */
.rp-section-title{
  margin: 10px 2px 8px;
  font-size: 12px;
  letter-spacing: .06em;
  text-transform: uppercase;
  font-weight: 800;
}

/* Card (like Card.jsx) */
.rp-card{
  background: ${theme.card};
  border: 3px solid ${theme.accent};
  border-radius: ${theme.radius}px;
  box-shadow: 4px 4px 0 ${theme.accentDark};
  padding: 14px;
  break-inside: avoid;
}

/* Text blocks */
.rp-text{
  margin: 0;
  font-size: 13.5px;
  line-height: 1.45;
}
.rp-hint{
  margin-top: 8px;
  color: ${theme.muted};
  font-size: 12px;
  line-height: 1.4;
}

/* Badges (like Badge.jsx) */
.rp-badges{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.rp-badge{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  border: 2px solid ${theme.accent};
  background: transparent;
  color: ${theme.text};
}

/* Table (print-friendly version of ConjugationTable) */
.rp-table-wrap{ width: 100%; overflow: hidden; }
.rp-table{
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
  font-size: 12.5px;
  line-height: 1.35;
}
.rp-table th, .rp-table td{
  padding: 8px 8px;
  vertical-align: top;
  border-bottom: 1px solid rgba(0,0,0,.12);
}
.rp-table th{
  text-transform: uppercase;
  font-size: 10.5px;
  letter-spacing: .06em;
  color: ${theme.muted};
  text-align: left;
  border-bottom: 2px solid ${theme.accent};
}

/* Examples blocks (like Examples.jsx) */
.rp-example{
  background: #fff;
  border: 2px solid ${theme.accent};
  border-radius: 14px;
  padding: 10px;
  margin: 6px 0;
}
.rp-example-en{ font-weight: 700; }
.rp-example-ua{ color: ${theme.muted}; margin-top: 2px; }

/* Mistakes */
.rp-ul{ margin: 6px 0 0; padding-left: 18px; }
.rp-ul li{ margin: 6px 0; }
.rp-note{
  margin-top: 8px;
  padding: 10px 12px;
  border-left: 4px solid ${theme.accent};
  background: #fff;
  border-radius: 10px;
  color: ${theme.muted};
  font-size: 12px;
  line-height: 1.4;
}

/* Spacing between sections */
.rp-block{ margin-bottom: 12px; }

/* Avoid weird page breaks */
.rp-card, .rp-example, table, tr { break-inside: avoid; page-break-inside: avoid; }
  `.trim();

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
            ? `<thead><tr>${s.headers
                .map((h) => `<th>${escapeAttr(h)}</th>`)
                .join("")}</tr></thead>`
            : ""
    }
            <tbody>
              ${(s.rows ?? [])
        .map(
            (row) =>
                `<tr>${(row ?? [])
                    .map((cell) => `<td>${cell ?? ""}</td>`)
                    .join("")}</tr>`
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
                return ""; // ignore unknown sections
        }
    };

    const sectionsHtml = (rulePage.sections ?? [])
        .map(renderSection)
        .filter(Boolean)
        .join("\n");

    // Note: we keep HTML inside rule strings as-is (strong/em/u), like dangerouslySetInnerHTML does.
    return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeAttr(brandTitle)} — ${escapeAttr(rulePage.title ?? rulePage.id ?? "Rule")}</title>
  <style>
${fontFaces}
${css}
  </style>
</head>
<body>
  <div class="rp-wrap">
    <div class="rp-top">
      <div class="rp-brand">${escapeAttr(brandTitle)}</div>
      <div class="rp-title">${escapeAttr(rulePage.title ?? rulePage.id ?? "")}</div>
    </div>

    ${rulePage.subtitle ? `<p class="rp-text" style="color:${theme.muted}; margin:0 0 10px 0;">${escapeAttr(rulePage.subtitle)}</p>` : ""}

    ${sectionsHtml}
  </div>
</body>
</html>`;
}
