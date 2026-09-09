const locales = import.meta.glob("./data/*.json", { eager: true });

const UI_LABELS = {
    hint: {
        "uk-UA": "Підказка",
        "ru-RU": "Подсказка",
        "pl-PL": "Wskazówka",
        "de-DE": "Hinweis",
        "fr-FR": "Indice",
        "es-ES": "Pista",
        "it-IT": "Suggerimento",
        "pt-PT": "Dica",
        "nl-NL": "Tip",
        "sv-SE": "Tips",
        "no-NO": "Tips",
        "da-DK": "Tip",
        "fi-FI": "Vihje",
        "cs-CZ": "Nápověda",
        "sk-SK": "Pomôcka",
        "hu-HU": "Tipp",
        "ro-RO": "Indiciu",
        "bg-BG": "Подсказка",
        "el-GR": "Υπόδειξη",
        "tr-TR": "İpucu",
        "zh-CN": "提示",
        "ja-JP": "ヒント",
        "ko-KR": "힌트",
        "th-TH": "คำใบ้",
        "vi-VN": "Gợi ý",
        "id-ID": "Petunjuk",
        "ms-MY": "Petunjuk",
        "he-IL": "רמז",
        "ar-SA": "تلميح",
    },
    showHint: {
        "uk-UA": "Показати підказку",
        "ru-RU": "Показать подсказку",
        "pl-PL": "Pokaż wskazówkę",
        "de-DE": "Hinweis anzeigen",
        "fr-FR": "Afficher l’indice",
        "es-ES": "Mostrar pista",
        "it-IT": "Mostra suggerimento",
        "pt-PT": "Mostrar dica",
        "nl-NL": "Toon tip",
        "sv-SE": "Visa tips",
        "no-NO": "Vis tips",
        "da-DK": "Vis tip",
        "fi-FI": "Näytä vihje",
        "cs-CZ": "Zobrazit nápovědu",
        "sk-SK": "Zobraziť pomôcku",
        "hu-HU": "Tipp mutatása",
        "ro-RO": "Arată indiciul",
        "bg-BG": "Покажи подсказка",
        "el-GR": "Εμφάνιση υπόδειξης",
        "tr-TR": "İpucunu göster",
        "zh-CN": "显示提示",
        "ja-JP": "ヒントを表示",
        "ko-KR": "힌트 보기",
        "th-TH": "แสดงคำใบ้",
        "vi-VN": "Hiện gợi ý",
        "id-ID": "Tampilkan petunjuk",
        "ms-MY": "Tunjukkan petunjuk",
        "he-IL": "הצג רמז",
        "ar-SA": "إظهار التلميح",
    },
    hideHint: {
        "uk-UA": "Сховати підказку",
        "ru-RU": "Скрыть подсказку",
        "pl-PL": "Ukryj wskazówkę",
        "de-DE": "Hinweis ausblenden",
        "fr-FR": "Masquer l’indice",
        "es-ES": "Ocultar pista",
        "it-IT": "Nascondi suggerimento",
        "pt-PT": "Ocultar dica",
        "nl-NL": "Verberg tip",
        "sv-SE": "Dölj tips",
        "no-NO": "Skjul tips",
        "da-DK": "Skjul tip",
        "fi-FI": "Piilota vihje",
        "cs-CZ": "Skrýt nápovědu",
        "sk-SK": "Skryť pomôcku",
        "hu-HU": "Tipp elrejtése",
        "ro-RO": "Ascunde indiciul",
        "bg-BG": "Скрий подсказка",
        "el-GR": "Απόκρυψη υπόδειξης",
        "tr-TR": "İpucunu gizle",
        "zh-CN": "隐藏提示",
        "ja-JP": "ヒントを非表示",
        "ko-KR": "힌트 숨기기",
        "th-TH": "ซ่อนคำใบ้",
        "vi-VN": "Ẩn gợi ý",
        "id-ID": "Sembunyikan petunjuk",
        "ms-MY": "Sembunyikan petunjuk",
        "he-IL": "הסתר רמז",
        "ar-SA": "إخفاء التلميح",
    },
};

export default class LocalizationService {

    resolveLocale = (value) => {
        const requested = String(value ?? "").trim().replaceAll("_", "-").toLowerCase();
        if (!requested) return null;

        const exact = this.BASE_LOCALES.find(({locale}) => locale.toLowerCase() === requested);
        if (exact) return exact.locale;

        const language = requested.split("-")[0];
        return this.BASE_LOCALES.find(({locale}) => locale.toLowerCase().split("-")[0] === language)?.locale
            ?? null;
    };

    setLocale = (locale) => {
        const resolved = this.resolveLocale(locale);
        if (resolved) localStorage.setItem("localization", resolved);
    };

    getLocale = () => {
        return this.resolveLocale(localStorage.getItem("localization"));
    };

    isLocaleDefined = () => {
        return !!this.getLocale();
    };

    BASE_LOCALES = [
        { locale: "uk-UA", name: "Українська" },
        { locale: "ru-RU", name: "Русский" },
        { locale: "pl-PL", name: "Polski" },
        { locale: "de-DE", name: "Deutsch" },
        { locale: "fr-FR", name: "Français" },
        { locale: "es-ES", name: "Español" },
        { locale: "it-IT", name: "Italiano" },
        { locale: "pt-PT", name: "Português" },
        { locale: "nl-NL", name: "Nederlands" },

        { locale: "sv-SE", name: "Svenska" },
        { locale: "no-NO", name: "Norsk" },
        { locale: "da-DK", name: "Dansk" },
        { locale: "fi-FI", name: "Suomi" },
        { locale: "cs-CZ", name: "Čeština" },
        { locale: "sk-SK", name: "Slovenčina" },
        { locale: "hu-HU", name: "Magyar" },
        { locale: "ro-RO", name: "Română" },
        { locale: "bg-BG", name: "Български" },
        { locale: "el-GR", name: "Ελληνικά" },
        { locale: "tr-TR", name: "Türkçe" },

        { locale: "zh-CN", name: "中文 (简体)" },
        { locale: "ja-JP", name: "日本語" },
        { locale: "ko-KR", name: "한국어" },
        { locale: "th-TH", name: "ไทย" },
        { locale: "vi-VN", name: "Tiếng Việt" },
        { locale: "id-ID", name: "Bahasa Indonesia" },
        { locale: "ms-MY", name: "Bahasa Melayu" },
        { locale: "he-IL", name: "עברית" },
        { locale: "ar-SA", name: "العربية" },
    ];

    getAvailableLocales = () => {
        const browserLocale = navigator.language;
        const locales = [...this.BASE_LOCALES];

        let recommended = null;

        if (browserLocale) {
            recommended = locales.find(l =>
                l.locale.toLowerCase().startsWith(browserLocale.slice(0, 2).toLowerCase())
            );
        }

        const rest = locales
            .filter(l => !recommended || l.locale !== recommended.locale)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (!recommended) return rest;

        return [recommended, ...rest];
    };

    localize = (key) => {
        const locale = this.getLocale() || "uk-UA";

        if (UI_LABELS[key]) {
            return UI_LABELS[key][locale] || UI_LABELS[key]["uk-UA"] || key;
        }

        const dict = locales[`./data/${locale}.json`];

        if (!dict) return key;

        const data = dict.default || dict;

        return data[key] || key;
    };
}

export const localizationService = new LocalizationService();
