import type { Language } from "types/localization";

export const fallbackLanguage = "en";
export const defaultNamespace = "default";
export const languages: Language[] = [fallbackLanguage, "de"];

export function getI18nOptions(
  lng = fallbackLanguage,
  ns: string | string[] = defaultNamespace
) {
  return {
    supportedLngs: languages,
    fallbackLng: fallbackLanguage,
    lng,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
  };
}
