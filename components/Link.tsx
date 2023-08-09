"use client";

import NextLink from "next/link";
import { type ComponentProps, memo, useMemo } from "react";

import type { Language } from "types/localization";

type NextLinkProps = ComponentProps<typeof NextLink>;

interface Props extends Omit<NextLinkProps, "locale"> {
  locale: Language;
}

function isAbsolute(href: NextLinkProps["href"]): boolean {
  const url = href.toString();
  const result = url.startsWith("http://") || url.startsWith("https://");
  if (!!result) {
    console.warn(
      "External URL's should use <a> rather than the link component",
      url
    );
  }
  return result;
}

function hasLocale(href: NextLinkProps["href"], locale: Language): boolean {
  const url = href.toString();
  const result = url === `/${locale}` || url.startsWith(`/${locale}/`);
  if (!!result) {
    console.warn(
      "The locale should never be provided manually through the `href` prop.",
      url
    );
  }
  return result;
}

function localize(href: NextLinkProps["href"], locale: Language): string {
  return `/${locale}/${href}`.replace(/\/+/g, "/");
}

/**
 * ### Component - Link
 *
 * A custom implementation of the Next.js Link component. This component
 * sets the scroll prop to true by default, which will scroll the page to
 * the top when the route changes. This is the desired behavior for most
 * links on the site.
 *
 * Implemented the locally, memoized `url` property, this prevents stale cache
 * data when using the link component with dynamic segments by ensuring that
 * the locale is set for the url.
 *
 * Furthermore the `I18nMiddleware` was optimized so that URL's that already contain
 * a locale are not checked by the rest of the middleware.
 */
const Link = memo(function Link(props: Props): JSX.Element {
  const { scroll = true, locale, href, ...rest } = props;

  const url = useMemo(() => {
    // return if it is a absolute url
    if (isAbsolute(href)) return href;
    // return if locale is already in url
    if (hasLocale(href, locale)) return href;
    // return localized version of the url
    return localize(href, locale);
  }, [locale, href]);

  return <NextLink scroll={scroll} href={url} locale={locale} {...rest} />;
});

export default Link;
export type { Props as LinkProps };
