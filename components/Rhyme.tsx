"use client";

import useDictionary from "hooks/useDictionary";
import type { Language } from "types/localization";

interface Props {
  language: Language;
}

export default function Rhyme({ language }: Props) {
  const { t } = useDictionary(language);
  return (
    <div
      style={{
        marginTop: 20,
        padding: 24,
        borderRadius: 2,
        border: "1px solid #000",
      }}
    >
      {t("rhyme")}
    </div>
  );
}

export type { Props as RhymeProps };
