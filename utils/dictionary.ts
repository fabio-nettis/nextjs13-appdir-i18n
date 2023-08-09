import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import { defaultNamespace, getI18nOptions } from "utils/i18next.config";

const initI18next = async (lang: string, ns: string | string[]) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (locale: string, namespace: string) =>
          import(`../i18n/${locale}/${namespace}.json`)
      )
    )
    .init(getI18nOptions(lang, ns));

  return i18nInstance;
};

export default async function getDictionary(
  language: string,
  namespaces: string | string[] = defaultNamespace
) {
  const i18nextInstance = await initI18next(language, namespaces);
  return {
    i18n: i18nextInstance,
    t: i18nextInstance.getFixedT(language, namespaces),
  };
}
