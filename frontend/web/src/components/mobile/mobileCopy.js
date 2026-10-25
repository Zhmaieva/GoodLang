import { localizationService } from "../../localization/localizationService.js";

// Keep the saved translation language; Ukrainian UI follows the supplied mockups.
export function mobileCopy(ukrainian, english) {
    return (localizationService.getLocale() || "uk-UA") === "uk-UA" ? ukrainian : english;
}
