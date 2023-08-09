import Link from "components/Link";
import Rhyme from "components/Rhyme";
import getDictionary from "utils/dictionary";
import type { ParamsWithLanguage } from "types/localization";

interface Props {
  params: ParamsWithLanguage;
}

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  const { t } = await getDictionary(locale, ["default", "file-1", "file-2"]);
  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "24px", margin: 24 }}>
      <h1>
        {/* You can prefix the translation name with on of the namespaces imported */}
        {t("file-1:hello")} {t("file-2:world")}!
      </h1>

      <p>
        <code>app/[locale]/page.tsx</code>
      </p>
      <p>
        Locale: <code>{locale}</code>
      </p>

      {/**
       * Client component using the useDictionary hook. You will see a delay on the first render
       * because the dictionary is loaded asynchronously, this delay is only visible in
       * development.
       */}
      <Rhyme language={locale} />

      <ul>
        {locale === "de" && (
          <li>
            <Link href="/" locale="en">
              EN
            </Link>
          </li>
        )}

        {locale === "en" && (
          <li>
            <Link href="/" locale="de">
              DE
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export type { Props as HomePageProps };
