const locales = import.meta.glob("./data/*.json", { eager: true });

export default class LocalizationService {

    setLocale = (locale) => {
        localStorage.setItem("localization", locale);
    };

    getLocale = () => {
        return localStorage.getItem("localization");
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

        const dict = locales[`./data/${locale}.json`];

        if (!dict) return key;

        const data = dict.default || dict;

        return data[key] || key;
    };
}

export const localizationService = new LocalizationService();