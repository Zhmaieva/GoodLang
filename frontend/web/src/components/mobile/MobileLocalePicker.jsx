import { Check, MagnifyingGlass } from "@phosphor-icons/react";
import MobileSheet from "./MobileSheet.jsx";
import { mobileCopy as t } from "./mobileCopy.js";
import "./mobile-locale.css";

function localeFlag(locale) {
    const region = String(locale ?? "").split("-")[1]?.toUpperCase();
    if (!region || region.length !== 2) return "";
    return String.fromCodePoint(...[...region].map((letter) => 127397 + letter.charCodeAt(0)));
}

export default function MobileLocalePicker({ options, selected, query, canCancel, onQueryChange, onSelect, onClose, onContinue }) {
    return <MobileSheet
        title={t("Мова перекладу", "Translation language")}
        className="gl-locale-sheet"
        dismissible={canCancel}
        onClose={canCancel ? onClose : undefined}
        footer={<button type="button" className="gl-primary" disabled={!selected} onClick={onContinue}>
            {canCancel ? t("Зберегти", "Save") : t("Продовжити", "Continue")}
        </button>}
    >
        <p className="gl-locale-description">
            {t("З цієї мови перекладатимемо англійською.", "Translate from this language into English.")}
        </p>
        <label className="gl-locale-search">
            <MagnifyingGlass size={20} aria-hidden="true" />
            <input
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={t("Знайти мову", "Search languages")}
                aria-label={t("Знайти мову", "Search languages")}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
            />
        </label>
        <ul className="gl-locale-list" aria-label={t("Доступні мови", "Available languages")}>
            {options.map((option) => {
                const active = selected === option.locale;
                return <li key={option.locale}>
                    <button type="button" className="gl-locale-option" aria-pressed={active} onClick={() => onSelect(option.locale)}>
                        <span className="gl-locale-flag" aria-hidden="true">{localeFlag(option.locale)}</span>
                        <span className="gl-locale-name">{option.name}</span>
                        <span className="gl-locale-check" aria-hidden="true">{active && <Check size={14} weight="bold" />}</span>
                    </button>
                </li>;
            })}
            {options.length === 0 && <li className="gl-locale-empty" role="status">
                {t("Мову не знайдено. Спробуйте інший запит.", "No languages found. Try another search.")}
            </li>}
        </ul>
    </MobileSheet>;
}
