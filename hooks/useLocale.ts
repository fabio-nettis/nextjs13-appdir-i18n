"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";

import type { Language } from "types/localization";
import { fallbackLanguage, languages } from "utils/i18next.config";

export default function useLocale(): Language {
  const params = useParams();
  const pathname = usePathname();

  const localeFromParams = useMemo(() => {
    return params?.locale as Language | undefined;
  }, [params.locale]);

  const localeFromPathname = useMemo(() => {
    return pathname?.split?.("/")?.[1] as Language | undefined;
  }, [pathname]);

  const finalLocale = useMemo(() => {
    const decision = localeFromParams ?? localeFromPathname;
    if (!!decision && languages.includes(decision)) return decision;
    return fallbackLanguage;
  }, [localeFromParams, localeFromPathname]);

  return finalLocale;
}
