import HTML from "components/HTML";
import I18nProvider from "components/I18nProvider";

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <HTML>
      <I18nProvider />
      <head />
      <body>{props.children}</body>
    </HTML>
  );
}
