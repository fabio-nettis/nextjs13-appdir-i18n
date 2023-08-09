"use client";

import i18next from "i18next";
import { memo, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import useLocale from "hooks/useLocale";
import { getI18nOptions } from "utils/i18next.config";

const backend = resourcesToBackend((language: string, namespace: string) => {
  return import(`../i18n/${language}/${namespace}.json`);
});

const instance = i18next.use(initReactI18next).use(backend);
instance.init(getI18nOptions());

const I18nProvider = memo(function I18nProvider(): JSX.Element {
  const locale = useLocale();
  const i18n = useMemo(() => ({ ...instance, language: locale }), [locale]);
  return <I18nextProvider i18n={i18n} />;
});

export default I18nProvider;
