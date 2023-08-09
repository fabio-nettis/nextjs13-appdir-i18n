"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { defaultNamespace } from "utils/i18next.config";

export default function useDictionary(
  locale: string,
  namespace: string | string[] = defaultNamespace
) {
  const result = useTranslation(namespace);

  useEffect(() => {
    if (result.i18n.language !== locale) {
      result.i18n.changeLanguage(locale);
    }
  }, [locale]);

  return result;
}
