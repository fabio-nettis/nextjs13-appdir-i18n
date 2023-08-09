import { type NextRequest, NextResponse } from "next/server";

import type { Language } from "types/localization";
import { fallbackLanguage, languages } from "utils/i18next.config";

function getHostname(request: NextRequest) {
  const { protocol, host } = request.nextUrl;
  return `${protocol}//${host}`;
}

function getLocale(request: NextRequest) {
  function getAcceptedLocale(): Language | undefined {
    const headerValue = request.headers.get("accept-language");
    if (!headerValue) return undefined;

    const options = headerValue.split(",");
    for (const option of options) {
      const [locale] = option.trim().split(";")[0].split("-");
      if (!locale || locale.length !== 2) return undefined;
      const extracted = locale.toLowerCase() as Language;
      if (languages.includes(extracted)) return extracted;
    }

    return undefined;
  }

  function getPreferredLocale(): Language | undefined {
    const headerValue = request.headers.get("X-Language-Preference");
    const cookieValue = request.cookies.get("language-preference");
    if (!headerValue && !cookieValue) return undefined;
    return (headerValue ?? cookieValue?.value)?.toLowerCase() as Language;
  }

  function getCurrentLocale(): Language | undefined {
    const host = getHostname(request);
    const relativeURL = request.nextUrl.toString().replace(host, "");
    const locale = relativeURL.split("/")[1] as Language;
    if (!locale || locale.length !== 2) return undefined;
    if (languages.includes(locale)) return locale;
    return undefined;
  }

  const current = getCurrentLocale();
  const accepted = getAcceptedLocale();
  const preferred = getPreferredLocale();

  if (current) {
    return { code: current, origin: "url", redirect: false };
  }

  if (preferred) {
    return { code: preferred, origin: "preference", redirect: !current };
  }

  if (accepted) {
    return { code: accepted, origin: "header", redirect: !current };
  }

  return { code: fallbackLanguage, origin: "fallback", redirect: !current };
}

function isExcluded(request: NextRequest): boolean {
  const excludes = [
    "/i18n",
    "/images",
    "/browserconfig.xml",
    "/site.webmanifest",
    "/sitemap",
    "/robots.txt",
    "/api",
    "/_next/static",
    "/_next/image",
    "/assets",
    "/favicon.ico",
    "/sw.js",
    "/service-worker.js",
  ];

  const host = getHostname(request);
  const relativeURL = request.nextUrl.toString().replace(host, "");
  return excludes.some((path) => relativeURL.startsWith(path));
}

function setPreference(response: NextResponse, locale: string) {
  response.headers.set("X-Language-Preference", locale);
  response.cookies.set("language-preference", locale);
  return response;
}

export default async function middleware(request: NextRequest) {
  if (isExcluded(request)) return undefined;
  const locale = getLocale(request);

  // redirect the user to the correct locale
  if (locale.redirect) {
    const host = getHostname(request);
    const relative = request.nextUrl.toString().replace(host, "");
    const separator = relative.startsWith("/") ? "" : "/";

    const redirect = `${host}${`/${locale.code}${separator}${relative}`.replace(
      /(\/{2,})/g,
      "/"
    )}`;

    return setPreference(NextResponse.redirect(redirect), locale.code);
  }

  return setPreference(NextResponse.next(), locale.code);
}
