export type Language = "en" | "de";

export type ParamsWithLanguage<T extends object = {}> = {
  locale: Language;
} & T;
